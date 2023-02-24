<template>
    <div>
        <v-container>

            <v-card class="mx-auto my-4">
                <v-card-title class="text-h6 mb-1">APIHost</v-card-title>
                <v-text-field
                        label="Input URL"
                        :rules="apiHostRules"
                        :value="apiHostURL"
                        hide-details="auto"
                        id="apiHostInput"
                        class="px-4"
                ></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="updateAPIHostStore()" color="info">Update</v-btn>
                </v-card-actions>
            </v-card>
            <v-card class="mx-auto my-4">


                <v-card-actions>
                    <v-card-title class="text-h6 mb-1">Status</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn text @click="getStatus()" color="success">Refresh</v-btn>
                </v-card-actions>
                <json-viewer
                    :value="statusData"
                    :expand-depth=1
                ></json-viewer>
            </v-card>
            <v-card class="mx-auto my-4">
                <v-card-title class="text-h6 mb-1">Recording</v-card-title>


                <v-card-actions class="mb-4">
                    <v-text-field
                        label="Input Tag"
                        :rules="recordingTagRules"
                        :value="recordingTag"
                        hide-details="auto"
                        id="recordingTag"
                        class="px-4"
                    ></v-text-field>
                    <v-divider vertical class="mx-4"></v-divider>

                    <v-btn @click="recordingStart()" color="success">Start</v-btn>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-btn @click="recordingStop()" color="error">Stop</v-btn>
                    <v-divider vertical class="mx-4"></v-divider>
                </v-card-actions>
                <json-viewer
                        :value="recordingData"
                        :expand-depth=1
                ></json-viewer>
            </v-card>


        </v-container>
    </div>
</template>

<script>
// import axios from "axios";
import {mdiAlarmLight} from "@mdi/js";
import axios from "axios";
import {Notify} from "vuetify-message-snackbar";
import JsonViewer from 'vue-json-viewer'

// function getRootPath() {
//   return window.location.protocol + '//' + window.location.host;
// }

var go;

export default {
    name: "Control",
    data: () => ({
        // username: localStorage.getItem("username"),
        // healthOK: false,
        // healthTimeout: "-1ms",
        // healthColor: "red"
        apiHostURL: "http://localhost:8080",
        statusRecording: "Unknown",
        statusSingleShot: "Unknown",
        apiHostRules: [
            value => !!value || 'Required.',
        ],
        recordingTag: "",
        recordingTagRules: [
            value => !!value || 'Required.',
        ],
        statusData: {},
        recordingData: {}

    }),

    mounted: function () {
        this.setGlobalTitle();
        let _apiHostURL = localStorage.getItem('apiHostURL')
        console.log(localStorage.getItem('apiHostURL'))
        if (_apiHostURL !== null && _apiHostURL !== '' && _apiHostURL !== 'undefined') {
            this.apiHostURL = _apiHostURL
        }
        this.getStatus()
        // go = window.setInterval(this.getStatus, 10000);
    },
    methods: {
        initialize() {

        },
        setGlobalTitle: function () {
            var myElement = document.getElementById("global-title");
            myElement.textContent = "Dashboard";
        },
        getStatus: function () {
            let apiHostURL = localStorage.getItem('apiHostURL')
            if (!(apiHostURL !== null && apiHostURL !== '' && apiHostURL !== 'undefined')) {
                this.$message.error("APIHostURL not defined")
                return
            }
            let statusURL = new URL('/v1/azure/status', apiHostURL)
            // console.log(statusURL.href)
            try {
                axios.get(statusURL.href).then(response => {
                    if (response.status === 200) {
                        // console.log(JSON.stringify(response.data, null, "    "))
                        this.statusData = response.data
                        this.statusRecording = response.data.status ? "OK" : "FAILED"
                    } else {
                        this.statusData = {}
                        this.$message.error("Server Error")
                    }
                })
            } catch (err) {
                this.$message.error(err)
            }
        },
        updateAPIHostStore: function () {
            localStorage.setItem('apiHostURL', document.getElementById("apiHostInput").value);
            window.location.reload()
        },
        recordingStart: function () {
            let apiHostURL = localStorage.getItem('apiHostURL')
            if (!(apiHostURL !== null && apiHostURL !== '' && apiHostURL !== 'undefined')) {
                this.$message.error("APIHostURL not defined")
                return
            }
            let statusURL = new URL('/v1/azure/start', apiHostURL).href
            let recordingTag = document.getElementById("recordingTag").value
            statusURL = statusURL + "?tag=" + recordingTag
            try {
                axios.post(statusURL).then(response => {
                    if (response.status === 200) {
                        console.log(JSON.stringify(response.data, null, "    "))
                        this.recordingData = response.data
                    } else {
                        this.recordingData = {}
                        this.$message.error("Server Error")
                    }
                })
            } catch (err) {
                this.$message.error(err)
            }
        },
        recordingStop: function () {
            let apiHostURL = localStorage.getItem('apiHostURL')
            if (!(apiHostURL !== null && apiHostURL !== '' && apiHostURL !== 'undefined')) {
                this.$message.error("APIHostURL not defined")
                return
            }
            let statusURL = new URL('/v1/azure/stop', apiHostURL)
            console.log(statusURL.href)
            try {
                axios.post(statusURL.href, "").then(response => {
                    if (response.status === 200) {
                        console.log(JSON.stringify(response.data, null, "    "))
                        this.recordingData = response.data
                        this.$message.top().color("success")("Recording Stopped")
                    } else {
                        this.recordingData = {}
                        this.$message.error("Server Error")
                    }
                })
            } catch (err) {
                this.$message.error(err)
            }
        }


    },
    computed: {},
    created() {
        this.initialize()
    },
};
</script>
