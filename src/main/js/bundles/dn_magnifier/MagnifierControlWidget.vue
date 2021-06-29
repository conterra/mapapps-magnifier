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
        <v-flex
            xs12
            px-4
        >
            <v-slider
                v-model="factor"
                class="pt-10"
                hide-details
            />
        </v-flex>
        <v-flex
            xs12
            px-4
        >
            <v-slider
                v-model="size"
                class="pt-10"
                hide-details
            />
        </v-flex>
        <v-flex
            xs12
            px-4
        >
            <v-button
                v-model="offset"
                class="pt-10"
                hide-details
            />
        </v-flex>
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
            offset: {
                type: Boolean,
                default: true
            }
        },
        watch:{
            factor: {
                handler(value) {
                    this.$emit('adjust-factor', value);
                }
            },
            size: {
                handler(value) {
                    this.$emit('adjust-size', value)
                }
            },
            offset: {
                handler(value) {
                    this.$emit('toggle-offset', value)
                }
            }
        }
    }
</script>
