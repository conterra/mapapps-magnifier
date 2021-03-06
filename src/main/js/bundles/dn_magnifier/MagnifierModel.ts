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

import { declare } from "apprt-core/Mutable";

export default declare({

    factor: 1.5,
    maskEnabled: true,
    maskUrl: null,
    offset: { x: 0, y: 0 },
    offsetEnabled: true,
    overlayEnabled: true,
    overlayUrl: null,
    size: 120,
    showControlWidget: true,

    $watch: {
        "size"(value) {
            if (this.offsetEnabled) {
                this.offset.x = value / 2;
                this.offset.y = value / 2;
            }
        },
        "offsetEnabled"(value) {
            if (value) {
                this.offset.x = this.size / 2;
                this.offset.y = this.size / 2;
            }
            else {
                this.offset.x = 0;
                this.offset.y = 0;
            }
        }
    }
});
