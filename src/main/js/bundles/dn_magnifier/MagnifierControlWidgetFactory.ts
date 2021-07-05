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
import { InjectedReference } from "apprt-core/InjectedReference";
import ScreenPoint from "esri/geometry/ScreenPoint";
import widget from "esri/widgets/support/widget";
import async from "apprt-core/async";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import Vue from "apprt-vue/Vue";

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

export default class MagnifierControlWidgetFactory {

    private _magnifierController = null;
    private controlWidget = null;
    private _mapWidgetModel: InjectedReference;
    private _i18n = null;

    // prviate bindings....

    activate(): void {
        this._initComponent()
    }

    _initComponent(): void {
        const vm = this.controlWidget =  new Vue(MagnifierControlWidget);
        const model = this._mapWidgetModel;
        const controller = this._magnifierController
        vm.i18n = this._i18n.get()

        vm.$on('adjust-factor', (value) => {
            controller.adjustFactor(value)
        });

        vm.$on('adjust-size', (value) => {
            controller.adjustSize(value)
        });

        vm.$on('toggle-offset', function() {
            controller.toggleOffset()
        });

        Binding.for(vm, model)
            .syncAll("factor", "size", "offset", "offsetEnabled")
            .syncToLeftNow()
            .enable();
    }

    createInstance(): any {
        return VueDijit(this.controlWidget);
    }
}
