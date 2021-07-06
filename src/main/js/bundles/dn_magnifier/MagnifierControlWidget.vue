<!--

    Copyright (C) 2021 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-container
        class="pa-0 fullHeight magnifier-container"
    >
        <v-layout
            align-center
            justify-center
            column
            fill-height
            dense
        >
            <v-flex>
                <v-switch
                    v-model="offsetDisabled"
                    :label="i18n.ui.offsetDisabledLabel"
                    color="primary"
                />
            </v-flex>
            <v-flex>
                <v-slider
                    v-model="factor"
                    :label="i18n.ui.factorLabel"
                    thumb-label
                    step="0.5"
                    min="1"
                    max="25"
                    append-icon="zoom_in"
                    prepend-icon="zoom_out"
                />
            </v-flex>
            <v-flex>
                <v-slider
                    v-model="size"
                    :label="i18n.ui.sizeLabel"
                    thumb-label
                    min="32"
                    max="512"
                    append-icon="add"
                    prepend-icon="remove"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        props: {
            factor: {
                type: Number,
                default: 1.5
            },
            size: {
                type: Number,
                default: 120
            },
            offsetEnabled: {
                type: Boolean,
                default: () => true
            }
        },
        computed: {
            offsetDisabled: {
                get: function () {
                    return !this.offsetEnabled
                },
                set: function (value) {
                    this.offsetEnabled = !value;
                }
            }
        }
    }
</script>
