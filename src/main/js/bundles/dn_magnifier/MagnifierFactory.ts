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

import View from "esri/views/View";
import { InjectedReference } from "apprt-core/InjectedReference";
import ScreenPoint from "esri/geometry/ScreenPoint";
import widget from "esri/widgets/support/widget";

// Interface definition for magnifier properties outlined in manifest.json/app.json
interface PropertiesObject {
    factor: number,
    maskEnabled: boolean,
    maskUrl: string,
    offset: ScreenPoint,
    overlayEnabled: boolean,
    overlayUrl: string,
    position: ScreenPoint,
    size: number,
    visible: boolean
}

export default class MagnifierFactory {

    private tool = null;
    private controller = null;
    private bundleContext = null;
    private magnifierControlWidget = null;
    private serviceRegistration = null;
    private _properties: PropertiesObject;
    private _mapWidgetModel: InjectedReference;

    activate(componentContext: any) {
        console.log("activate()")
        // this.bundleContext = componentContext.getBundleContext();
        // this._initComponent();
    }

    deactivate(): void {
        this._destroyWidget();
    }

    onToolActivated(evt: Event): void {
        console.log("Tool activated")
        this.tool = evt.tool;
        this.controller = this._MagnifierController;

        const widget = this.getWidget(controller._getView());
        widget.own({
            remove() {
                widget.destroy();
            }
        });
        this._showWindow(widget);

    }

    _showWindow(widget: any): void {
        const serviceProperties = {
            "widgetRole": "dn_magnifier.MagnifierControlWidget"
        };
        const interfaces = ["dijit.Widget"];
        const content = widget
        this.serviceRegistration = this.bundleContext.registerService(interfaces, content, serviceProperties);

        async(() => {
            const window = ct_util.findEnclosingWindow(content);
            window.on("Hide", () => {
                this._hideWindow();
            });
        }, 1000);
    }

    _hideWindow(): void {
        this.elevationProfileWidget?.viewModel?.clear();
        this.elevationProfileWidget?.destroy();
        this.elevationProfileWidget = null;

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
    }

    getWidget(view: View): any { // return vuedijit this.vm
        const magnifierProperties = this.getMagnifierProperties(view);
        return this.magnifierControlWidget = new MagnifierControlWidget(magnifierProperties);
    }

    _destroyWidget(): void {
        this.magnifierControlWidget.destroy();
        this.magnifierControlWidget = undefined;
    }

    getMagnifierProperties(view: View): PropertiesObject {
        const properties = this._properties;
        return Object.assign({view: view}, properties);
    }

    _initComponent(): void {
        const vm = this.vm =  new Vue(MagnifierControlWidget);
        const model = this._mapWidgetModel;
        this.controller = this._MagnifierController;

        vm.$on('adjust-factor', (value) => {
            this.controller.adjustFactor(value)
        });

        vm.$on('adjust-size', (value) => {
            this.controller.adjustSize(value)
        });

        vm.$on('toggle-offset', (value) => {
            this.controller.toggleOffset(value)
        });

        Binding.for(vm, model)
            .syncAll("factor", "size", "offset", "offsetEnabled")
            .enable()
            .syncToLeftNow();
    }
}
