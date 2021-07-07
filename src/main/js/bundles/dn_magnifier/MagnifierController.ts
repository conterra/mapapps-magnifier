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
import { InjectedReference } from "apprt-core/InjectedReference";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import async from "apprt-core/async";
import Binding from "apprt-binding/Binding";
import ct_util from "ct/ui/desktop/util";
import View from "esri/views/View";

export default class {

    private bundleContext = null;
    private controlWidget = null;
    private moveEventHandler = null;
    private serviceRegistration = null;
    private modelBinding = null;
    private controlWidgetBinding = null;
    private _i18n = InjectedReference;
    private tool: InjectedReference;
    private mapWidgetModel: InjectedReference;
    private magnifierModel: InjectedReference;


    /**
     * Function called on component activation
     * Used to access bundleContext and if used, create the observer watching the magnifierModels properties
     * Finally, refreshes the magnifierModel properties to apply offset correctly
     * @param componentContext context information of the component
     */
    activate(componentContext: InjectedReference): void {
        this.bundleContext = componentContext.getBundleContext();

        this.getView().then((view: View) => {
            const magnifierModel = this.magnifierModel;

            if (magnifierModel.visible){
                this.showMagnifierComponents()
            }

            this.modelBinding = Binding.for(view.magnifier, magnifierModel)
                .syncAll(
                    "factor",
                    "maskEnabled",
                    "maskUrl",
                    "offset",
                    "offsetEnabled",
                    "overlayEnabled",
                    "overlayUrl",
                    "size",
                    "visible",
                    "showControlWidget"
                )
                .enable()
                .syncToLeftNow();
        });
    }

    /**
     * Function called on component deactivation
     * Hides the magnifier and the magnifierControlWidget and removes the observer
     */
    deactivate(): void {
        this.hideMagnifierComponents();

        this.modelBinding?.unbind();
        this.modelBinding = null;
    }

    /**
     * Function used to show magnifier
     * Uses magnifier properties stored in the magnifierModel as specified in manifest.json or app.json
     */
    showMagnifierComponents(): void {
        const magnifierModel = this.magnifierModel;

        this.getView().then((view: View) => {
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
        if (magnifierModel.showControlWidget) {
            this.showWindow();
        }
    }

    /**
     * Function used to hide magnifier
     */
    hideMagnifierComponents(): void {
        const magnifierModel = this.magnifierModel;

        this.getView().then((view: View) => {
            view.magnifier.visible = false;
            view.cursor = "default";
        });

        // remove mouse cursor movement listener to save resources
        this.moveEventHandler.remove();

        // if the magnifierControlWidget is enabled hide it alongside magnifier
        if (magnifierModel.showControlWidget) {
            this.hideWindow();
        }
    }

    /**
     * Helper function used to access the esri/views/View instance
     */
    private getView(): Promise<View> {
        const mapWidgetModel = this.mapWidgetModel;

        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            }
            else {
                mapWidgetModel.watch("view", ({ value: view }) => {
                    resolve(view);
                });
            }
        });
    }

    /**
     * Function used to display the magnifierControlWidget
     */
    private showWindow(): void {
        const widget = this.controlWidget = this.getControlWidget();
        const serviceProperties = {
            "widgetRole": "magnifierControlWidget"
        };
        const interfaces = ["dijit.Widget"];
        this.serviceRegistration = this.bundleContext.registerService(interfaces, widget, serviceProperties);

        async(() => {
            const window = ct_util.findEnclosingWindow(widget);
            window?.on("Hide", () => {
                this.hideWindow();
            });
        }, 1000);
    }

    /**
     * Function used to hide the magnifierControlWidget
     */
    private hideWindow(): void {
        const registration = this.serviceRegistration;
        // clear the reference

        this.serviceRegistration = null;
        if (registration) {
            // call unregister
            registration.unregister();
        }
        if (this.tool) {
            this.tool.set("active", false);
        }
        this.controlWidget = null;
        this.controlWidgetBinding?.unbind();
        this.controlWidgetBinding = null;
    }

    /**
     * Function used to construct VueDijit and create binding for magnifierControlWidget
     * @returns VueDijit of magnifierControlWidget
     */
    private getControlWidget(): InjectedReference {
        const vm = new Vue(MagnifierControlWidget);
        const model = this.magnifierModel;
        vm.i18n = this._i18n.get().ui;

        this.controlWidgetBinding = Binding.for(vm, model)
            .syncAll(
                "factor",
                "size",
                "offsetEnabled")
            .enable()
            .syncToLeftNow();

        return VueDijit(vm);
    }
}
