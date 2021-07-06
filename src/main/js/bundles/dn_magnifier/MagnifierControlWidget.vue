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
            row
            wrap
        >
            <v-flex xs12>
                <v-subheader class="pl-0">
                    {{ i18n.factorLabel }}
                </v-subheader>
                <v-slider
                    v-model="factor"
                    thumb-label="always"
                    step="0.5"
                    min="1"
                    max="25"
                    append-icon="zoom_in"
                    prepend-icon="zoom_out"
                    hide-details
                />
            </v-flex>
            <v-flex xs12>
                <v-subheader class="pl-0">
                    {{ i18n.sizeLabel }}
                </v-subheader>
                <v-slider
                    v-model="size"
                    thumb-label="always"
                    min="32"
                    max="512"
                    append-icon="add"
                    prepend-icon="remove"
                    hide-details
                />
            </v-flex>
            <v-flex xs12>
                <v-switch
                    v-model="offsetDisabled"
                    :label="i18n.offsetDisabledLabel"
                    class="pt-3 pl-2 ma-0"
                    color="primary"
                    hide-details
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
            },
            i18n: {
                type: Object,
                default: () => {
                }
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
