<template>
    <v-container fluid>
        <router-view></router-view>
    </v-container>
</template>

<script>
import axios from "axios";
import {mdiAlarmLight} from "@mdi/js";
import message from "vuetify-message-snackbar";

export default {
    name: "App",
    data: function () {
        return {
            drawer: null,
        };
    },
    methods: {},
    computed: {},
    mounted: function () {
        this.$message.vuetifyInstance = this.$vuetify
    }
};
</script>
