///
/// Copyright (C) 2021 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import MagnifierControlWidget from "./MagnifierControlWidget.vue";
import View from "esri/views/View";
import {InjectedReference} from "apprt-core/InjectedReference";
import async from "apprt-core/async";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import Vue from "apprt-vue/Vue";
import ct_util from "ct/ui/desktop/util";
import Observers from "apprt-core/Observers";

export default class {

    private serviceRegistration = null;
    private bundleContext = null;
    private controlWidget = null;
    private moveEventHandler = null;
    private observers = null;
    private _mapWidgetModel: InjectedReference;
    private _magnifierModel: InjectedReference;
    private _tool: InjectedReference;

    activate(componentContext) {
        this.bundleContext = componentContext.getBundleContext();
        this.observers = new Observers(undefined);

        const model = this._magnifierModel;
        this.observers.add(model.watch("factor",({value: value})=>{
            this.adjustFactor(value);
        }));
    }

    deactivate() {
        this.hideMagnifier();

        this.observers.clean();
        this.observers = null;
    }

    /**
     * Helper function used to access the esri/views/View instance
     */
    _getView(): Promise<View> {
        const mapWidgetModel = this._mapWidgetModel;

        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }

    /**
     * Function used to show magnifier
     * uses magnifier properties specified in manifest.json or app.json
     */
    showMagnifier(): void {

        const widget = this.controlWidget = this._getWidget();
        this._showWindow(widget);

        // access view
        this._getView().then((view: View) => {
            // finally, make magnifier visible
            view.magnifier.visible = true;

            // listen to pointer movements and move magnifier to new mouse cursor position
            this.moveEventHandler = view.on("pointer-move", function (event): void {
                view.magnifier.position = {
                    x: event.x,
                    y: event.y
                };
            });
            view.cursor = "crosshair";

        });
    }

    /**
     * Function used to hide magnifier
     */
    hideMagnifier(): void {
        this._hideWindow();

        // access view
        this._getView().then((view: View) => {
            // turn off visibility of the view's magnifier
            view.magnifier.visible = false;

            // remove eventListener to safe resources
            this.moveEventHandler.remove();

            view.cursor = "default";
        });
    }

    /**
     * Function used to determine offset distance of pointer and magnifier
     */
    calcOffset(): void {
        const magnifierModel = this._magnifierModel;

        const xOffset: number = magnifierModel.size / 2;
        const yOffset: number = magnifierModel.size / 2;

        magnifierModel.offset.x = xOffset;
        magnifierModel.offset.y = yOffset;
    }

    /**
     * Function used to apply changed properties to magnifier
     */
    refreshMagnifier(): void {
        const magnifierModel = this._magnifierModel;

        if (magnifierModel.offsetEnabled) {
            this.calcOffset();
        }

        this._updateMagnifierProps();
    }

    adjustFactor(value: number): void {
        const magnifierModel = this._magnifierModel;
        magnifierModel.factor = value;

        this.refreshMagnifier();
    }

    adjustSize(value: number): void {
        const magnifierModel = this._magnifierModel;
        magnifierModel.size = value;

        this.refreshMagnifier();
    }

    toggleOffset(): void {
        const magnifierModel = this._magnifierModel;
        const offsetState = !magnifierModel.offsetEnabled;

        if (offsetState) {
            this.calcOffset();

            magnifierModel.offsetEnabled = true;
        } else {
            magnifierModel.offset.x = 0;
            magnifierModel.offset.y = 0;

            magnifierModel.offsetEnabled = false;
        }
    }

    _getMagnifier() {
        this._getView().then((view: View) => {
            return view.magnifier;
        });
    }

    _updateMagnifierProps() {
        const model = this._magnifierModel;
        this._getView().then((view: View) => {
            // set properties of the view's magnifier according to manifest.json/app.json
            view.magnifier.factor = model.factor;
            view.magnifier.maskEnabled = model.maskEnabled;
            view.magnifier.maskUrl = model.maskUrl;
            view.magnifier.offset = model.offset;
            view.magnifier.overlayEnabled = model.overlayEnabled;
            view.magnifier.overlayUrl = model.overlayUrl;
            view.magnifier.size = model.size;
        });
    }

    _showWindow(widget) {
        const serviceProperties = {
            "widgetRole": "magnifierControlWidget"
        };
        const interfaces = ["dijit.Widget"];
        this.serviceRegistration = this.bundleContext.registerService(interfaces, widget, serviceProperties);

        async(() => {
            const window = ct_util.findEnclosingWindow(widget);
            window?.on("Hide", () => {
                this._hideWindow();
            });
        }, 1000);
    }

    _hideWindow() {
        this.controlWidget = null;
        const registration = this.serviceRegistration;

        // clear the reference
        this.serviceRegistration = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
        if (this._tool) {
            this._tool.set("active", false);
        }
    }

    _getWidget(): void {
        const vm = new Vue(MagnifierControlWidget);
        const model = this._magnifierModel;
        vm.i18n = this._i18n.get();

        // vm.$on('adjust-size', (value) => {
        //     this.adjustSize(value);
        // });
        //
        // vm.$on('toggle-offset', function () {
        //     this.toggleOffset();
        // });

        Binding.for(vm, model)
            .syncAll("factor", "size", "offsetEnabled")
            .enable()
            .syncToLeftNow();

        return VueDijit(vm);
    }

    _destroyWidget() {
        this.controlWidget.destroy();
        this.controlWidget = undefined;
    }

}
