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
import Vue from "apprt-vue/Vue";
import async from "apprt-core/async";
import ct_util from "ct/ui/desktop/util";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import Observers from "apprt-core/Observers";
import { InjectedReference } from "apprt-core/InjectedReference";

export default class {

    private _i18n = null;
    private observers = null;
    private bundleContext = null;
    private controlWidget = null;
    private moveEventHandler = null;
    private serviceRegistration = null;
    private _tool: InjectedReference;
    private _mapWidgetModel: InjectedReference;
    private _magnifierModel: InjectedReference;


    /**
     * Function called on component activation
     * Used to access bundleContext and if used, create the observer watching the magnifierModels properties
     * Finally, refreshes the magnifierModel properties to apply offset correctly
     * @param componentContext context information of the component
     */
    activate(componentContext: InjectedReference): void {
        this.bundleContext = componentContext.getBundleContext();
        const magnifierModel = this._magnifierModel;

        // if the magnifierControlWidget is used watch the managed properties
        if(magnifierModel.showControlWidget){
            this.observers = new Observers(undefined);

            this.observers.add(magnifierModel.watch("factor", ({ value: value }) => {
                this._setFactor(value);
            }));
            this.observers.add(magnifierModel.watch("size", ({ value: value }) => {
                this._setSize(value);
            }));
            this.observers.add(magnifierModel.watch("offsetEnabled", ({ value: value }) => {
                this.toggleOffset(value);
            }));
        }

        // refresh magnifierProperties to apply offset correctly
        this._updateMagnifierProps("offsetEnabled");
    }

    /**
     * Function called on component deactivation
     * Hides the magnifier and the magnifierControlWidget and removes the observer
     */
    deactivate(): void {
        this.hideMagnifierComponents();

        this.observers.clean();
        this.observers = null;

        // this._destroyWidget();
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
                mapWidgetModel.watch("view", ({ value: view }) => {
                    resolve(view);
                });
            }
        });
    }

    /**
     * Function used to show magnifier
     * Uses magnifier properties stored in the magnifierModel as specified in manifest.json or app.json
     */
    showMagnifierComponents(): void {
        const magnifierModel = this._magnifierModel;

        this._getView().then((view: View) => {
            view.magnifier.visible = true;

            // add listener to mouse cursor movements used to move magnifier to current location
            this.moveEventHandler = view.on("pointer-move", function (event): void {
                view.magnifier.position = {
                    x: event.x,
                    y: event.y
                };
            });

            // while a magnifier is shown, display mouse cursor as crosshairs
            view.cursor = "crosshair";
        });

        // if the magnifierControlWidget is enabled show it alongside magnifier
        if(magnifierModel.showControlWidget){
            const widget = this.controlWidget = this._getWidget();
            this._showWindow(widget);
        }
    }

    /**
     * Function used to hide magnifier
     */
    hideMagnifierComponents(): void {
        const magnifierModel = this._magnifierModel;

        this._getView().then((view: View) => {
            view.magnifier.visible = false;

            // remove mouse cursor movement listener to safe resources
            this.moveEventHandler.remove();

            view.cursor = "default";
        });

        // if the magnifierControlWidget is enabled hide it alongside magnifier
        if(magnifierModel.showControlWidget){
            this._hideWindow();
        }
    }

    /**
     * Function used to set magnification factor according to magnifierControlWidget inputs
     * @param value New magnification factor
     */
    _setFactor(value: number): void {
        const magnifierModel = this._magnifierModel;
        magnifierModel.factor = value;

        // update the magnifierModel factor attribute
        this._updateMagnifierProps("factor");
    }

    /**
     * Function used to set magnifier size according to magnifierControlWidget inputs
     * @param value New magnifier size
     */
    _setSize(value: number): void {
        const magnifierModel = this._magnifierModel;
        magnifierModel.size = value;

        // update the magnifierModel size attribute
        this._updateMagnifierProps("size");
    }

    /**
     * Function used to control magnifier offset
     * Turns magnifier offset on/off depending on magnifierControlWidget inputs
     * If on also calulates the correct offset depending on magnifier size
     * @param value Function
     */
    toggleOffset(value: boolean): void {
        const magnifierModel = this._magnifierModel;
        magnifierModel.offsetEnabled = value;

        if (value) {
            magnifierModel.offset.x = magnifierModel.size / 2;
            magnifierModel.offset.y = magnifierModel.size / 2;

        } else {
            magnifierModel.offset.x = 0;
            magnifierModel.offset.y = 0;
        }

        // update the magnifierModel offset attributes on/off and offset distance
        this._updateMagnifierProps("offsetEnabled");
    }

    /**
     * Function used to update the magnifier properties based on magnifierModel attribute changes
     * @param caller String used to determine which attribute to update
     */
    _updateMagnifierProps(caller: string): void {
        const magnifierModel = this._magnifierModel;
        this._getView().then((view: View) => {

            switch (caller) {
                case "factor":
                    view.magnifier.factor = magnifierModel.factor;
                    break;

                case "size":
                    view.magnifier.size = magnifierModel.size;
                    this.toggleOffset(magnifierModel.offsetEnabled);
                    break;

                case "offsetEnabled":
                    view.magnifier.offset.x = magnifierModel.offset.x;
                    view.magnifier.offset.y = magnifierModel.offset.y;
                    break;

                default:
                // no default
            }
        });
    }

    /**
     * Function used to display the magnifierControlWidget
     * @param widget VueDijit of magnifierControlWidget provided be getWidget()
     */
    _showWindow(widget: InjectedReference): void {
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

    /**
     * Function used to hide the magnifierControlWidget
     */
    _hideWindow(): void {
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

    /**
     * Function used to construct VueDijit and create binding for magnifierControlWidget
     * @returns VueDijit of magnifierControlWidget
     */
    _getWidget(): InjectedReference {
        const vm = new Vue(MagnifierControlWidget);
        const model = this._magnifierModel;
        vm.i18n = this._i18n.get();

        Binding.for(vm, model)
            .syncAll("factor", "size", "offsetEnabled")
            .enable()
            .syncToLeftNow();

        return VueDijit(vm);
    }

    /**
     * Function used to destroy the magnifierControlWidget
     */
    _destroyWidget(): void {
        this.controlWidget.destroy();
        this.controlWidget = undefined;
    }

}
