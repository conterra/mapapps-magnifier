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
            pt-3
            dense
        >
            <v-flex
                xs12
                px-4
            >
                <v-slider
                    v-model="factor"
                    :label="i18n.ui.factorLabel"
                    thumb-label
                    class="pt-10"
                    min="1"
                    max="25"
                    append-icon="zoom_in"
                    prepend-icon="zoom_out"
                />
            </v-flex>
            <v-flex
                xs12
                px-4
            >
                <v-slider
                    v-model="size"
                    :label="i18n.ui.sizeLabel"
                    thumb-label
                    class="pt-10"
                    min="32"
                    max="512"
                    append-icon="add"
                    prepend-icon="remove"
                />
            </v-flex>
            <v-flex
                xs12
                px-4
            >
                <v-btn
                    :class="{ primary: offsetEnabled, secondary: !offsetEnabled }"
                    @click="$emit('toggle-offset')"
                >
                    {{ i18n.ui.toggleButton }}
                </v-btn>
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
        watch:{
            size: {
                handler(value) {
                    this.$emit('adjust-size', value)
                }
            }
        }
    }
</script>
