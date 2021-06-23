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

    private _properties: PropertiesObject;
    private _mapWidgetModel: InjectedReference;

    /**
     * Function used to show magnifier
     * uses magnifier properties specified in manifest.json or app.json
     */
    showMagnifier(): void {
        // access view
        this._getView().then((view: View) => {
            // set properties of the view's magnifier according to manifest.json/app.json
            view.magnifier.factor = this._properties.factor;
            view.magnifier.maskEnabled = this._properties.maskEnabled;
            view.magnifier.maskUrl = this._properties.maskUrl;
            view.magnifier.offset = this._properties.offset;
            view.magnifier.overlayEnabled = this._properties.overlayEnabled;
            view.magnifier.overlayUrl = this._properties.overlayUrl;
            view.magnifier.size = this._properties.size;

            // finally, make magnifier visible
            view.magnifier.visible = true;

            // listen to pointer movements and move magnifier to new mouse cursor position
            view.on("pointer-move", function (event): void {
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
        // access view
        this._getView().then((view: View) => {
            // turn off visibility of the view's magnifier
            view.magnifier.visible = false;
        });
        view.cursor = "default";
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
}
