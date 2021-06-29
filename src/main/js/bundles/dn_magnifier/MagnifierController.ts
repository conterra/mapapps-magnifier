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

export default class {

    private moveEventHandler = null;

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
     * uses magnifier properties specified in manifest.json or app.json
     */
    showMagnifier(): void {

        // access view
        this._getView().then((view: View) => {

            const model = this._magnifierModel

            // set properties of the view's magnifier according to manifest.json/app.json
            view.magnifier.factor = model.factor;
            view.magnifier.maskEnabled = model.maskEnabled;
            view.magnifier.maskUrl = model.maskUrl;
            view.magnifier.offset = model.offset;
            view.magnifier.overlayEnabled = model.overlayEnabled;
            view.magnifier.overlayUrl = model.overlayUrl;
            view.magnifier.size = model.size;

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
        // access view
        this._getView().then((view: View) => {
            // turn off visibility of the view's magnifier
            view.magnifier.visible = false;

            // remove eventListener to safe resources
            this.moveEventHandler.remove();

            view.cursor = "default";
        });
    }

    adjustFactor(value: number): void{
        const magnifierModel = this._magnifierModel;
        magnifierModel.factor = value;
    }

    adjustSize(value: number): void{
        const magnifierModel = this._magnifierModel;
        magnifierModel.size = value;
    }

    toggleOffset(value: boolean): void{
        const magnifierModel = this._magnifierModel;

        if (value){
            const xOffset: number = magnifierModel.size / 2;
            const yOffset: number = magnifierModel.size / 2;

            magnifierModel.offset.x = xOffset;
            magnifierModel.offset.y = yOffset;

            magnifierModel.offsetEnabled = true;

        }
        else {
            magnifierModel.offsetEnabled = false;
        }
    }
}
