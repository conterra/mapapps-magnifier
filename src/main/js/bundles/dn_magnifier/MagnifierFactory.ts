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

import Magnifier from "esri/views/Magnifier";

// Interface describing Screenpoint used for offset calulcation of magnifier
interface ScreenPoint {
    x: number;
    y: number
}

// Interface describing the properties passed down from manifest.json
interface PropertiesObject {
    factor: number;
    size: number;
    offset: ScreenPoint
}

// Interface describing MapWidgetObject of the ArcGIS API without specifics to avoid TS errors
interface MapWidgetModelObject{
    content: any;
    view: any
}

const _magnifierWidget = Symbol("_magnifierWidget");


export default class MagnifierFactory {

    // Use defined interfaces
    _properties : PropertiesObject;
    _mapWidgetModel: MapWidgetModelObject;

    // Constructor for a magnifier instance using parameters from manifest.json
    createMagnifierInstance(){
        const magnifierWidget = this[_magnifierWidget] = new Magnifier({
            factor: this._properties.factor,
            size: this._properties.size,
            offset: this._properties.offset
        });

        return magnifierWidget
    }

    // Function triggered when toggle tool is used to activate tool
    showWidget() {

        // Build magnifier
        const magnifierWidget = this.createMagnifierInstance()

        // Get view, then ...
        this._getView().then((view) => {

            // ... assign magnifier
            view.magnifier = magnifierWidget

            // ... make magnifier visible (again)
            view.magnifier.visible = true;

            // Magnifier will be displayed whenever the cursor hovers over the map.
            view.on("pointer-move", function (event) {
                view.magnifier.position = { x: event.x, y: event.y };
            });
        });
    }

    deactivate(){
        this.hideWidget()
    }

    hideWidget() {
        this._getView().then((view) => {
            // Hide magnifier, else it will stay on the view non-interactively
            view.magnifier.visible = false;

            // Remove magnifier completely
            this[_magnifierWidget] = null;
            this[_magnifierWidget]?.destroy();
        });
    }

    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }
}
