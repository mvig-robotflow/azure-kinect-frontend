<template>
    <div>
        <v-container>

            <v-card class="mx-auto my-4">
                <v-card-title class="text-h6 mb-1">APIHost</v-card-title>
                <v-text-field label="Input Azure Kinect APIServer's URL" :rules="apiHostRules" :value="apiHostURL.kinect"
                    hide-details="auto" id="apiHostInput.kinect" class="px-4 my-4"></v-text-field>
                <v-text-field label="Input Arizion Force Sensor APIServer's URL" :rules="apiHostRules"
                    :value="apiHostURL.arizon" hide-details="auto" id="apiHostInput.arizon"
                    class="px-4 my-4"></v-text-field>
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
                <json-viewer :value="statusData" :expand-depth=1></json-viewer>
            </v-card>
            <v-card class="mx-auto my-4">
                <v-card-title class="text-h6 mb-1">Recording</v-card-title>


                <v-card-actions class="mb-4">
                    <v-text-field label="Input Tag" :rules="recordingTagRules" :value="recordingTag" hide-details="auto"
                        id="recordingTag" class="px-4"></v-text-field>
                    <v-checkbox v-model="toggleForce" label="Toggle Force" color="indigo" value="indigo"
                        hide-details></v-checkbox>
                    <v-divider vertical class="mx-4"></v-divider>

                    <v-btn text @click="refreshTag()" color="success">Refresh</v-btn>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-btn @click="recordingStart()" color="success">Start</v-btn>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-btn @click="recordingStop()" color="error">Stop</v-btn>

                    <v-divider vertical class="mx-4"></v-divider>
                </v-card-actions>
                <json-viewer :value="recordingResponse" :expand-depth=1></json-viewer>
            </v-card>


        </v-container>
    </div>
</template>

<script>
// import axios from "axios";
import { mdiAlarmLight } from "@mdi/js";
import axios from "axios";
import { Notify } from "vuetify-message-snackbar";
import JsonViewer from 'vue-json-viewer'

// function getRootPath() {
//   return window.location.protocol + '//' + window.location.host;
// }

var go;

function checkAPIHost(apiHostURL) {
    if (!(apiHostURL !== null && apiHostURL !== '' && apiHostURL !== 'undefined')) {
        // Notify.error("APIHostURL not defined")
        // console.log(apiHostURL)
        return false
    } else {
        return true
    }
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function getDefaultTag() {
    var dt = new Date();
    var str = pad(dt.getFullYear(), 4) + pad(dt.getMonth() + 1, 2) + pad(dt.getDate(), 2) + '_' + pad(dt.getHours(), 2) + pad(dt.getMinutes(), 2) + pad(dt.getSeconds(), 2);
    return str
}

export default {
    name: "Control",
    data: () => ({
        apiHostURL: {
            "kinect": "http://localhost:8080",
            "arizon": "http://localhost:8080"
        },

        statusRecording: "Unknown",
        statusSingleShot: "Unknown",
        apiHostRules: [
            value => !!value || 'Required.',
        ],
        recordingTag: getDefaultTag(),
        recordingTagRules: [
            value => !!value || 'Required.',
        ],
        statusData: {
            "kinect": {},
            "arizon": {}
        },
        recordingResponse: {},
        toggleForce: false

    }),

    mounted: function () {
        this.setGlobalTitle();
        let _apiHostURL_kinect = localStorage.getItem('apiHostURL.kinect')
        // console.log(localStorage.getItem('apiHostURL.kinect'))
        if (_apiHostURL_kinect !== null && _apiHostURL_kinect !== '' && _apiHostURL_kinect !== 'undefined') {
            this.apiHostURL.kinect = _apiHostURL_kinect
        }

        let _apiHostURL_arizon = localStorage.getItem('apiHostURL.arizon')
        // console.log(localStorage.getItem('apiHostURL.arizon'))
        if (_apiHostURL_arizon !== null && _apiHostURL_arizon !== '' && _apiHostURL_arizon !== 'undefined') {
            this.apiHostURL.arizon = _apiHostURL_arizon
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
            let apiHostURL = { kinect: localStorage.getItem('apiHostURL.kinect'), arizon: localStorage.getItem('apiHostURL.arizon') }

            // check Azure Kinect DK
            if (!checkAPIHost(apiHostURL.kinect)) {
                this.$message.error("APIHostURL.kinect not defined")
            } else {
                let statusURL = new URL('/v1/azure/status', apiHostURL.kinect)
                // console.log(statusURL.href)
                try {
                    axios.get(statusURL.href).then(response => {
                        if (response.status === 200) {
                            // console.log(JSON.stringify(response.data, null, "    "))
                            this.statusData.kinect = response.data
                            this.statusRecording = response.data.status ? "OK" : "FAILED"
                        } else {
                            this.statusData.kinect = {}
                            this.$message.error("Server Error")
                        }
                    })
                } catch (err) {
                    this.$message.error(err)
                }
            }

            // check Arizon Force Sensor
            if (!checkAPIHost(apiHostURL.arizon)) {
                this.$message.error("APIHostURL.arizon not defined")
            } else {
                let statusURL = new URL('/v1/arizon/status', apiHostURL.arizon)
                // console.log(statusURL.href)
                try {
                    axios.get(statusURL.href).then(response => {
                        if (response.status === 200) {
                            // console.log(JSON.stringify(response.data, null, "    "))
                            this.statusData.arizon = response.data
                        } else {
                            this.statusData.arizon = {}
                            this.$message.error("Server Error")
                        }
                    })
                } catch (err) {
                    this.$message.error(err)
                }
            }

        },
        updateAPIHostStore: function () {
            localStorage.setItem('apiHostURL.kinect', document.getElementById("apiHostInput.kinect").value);
            localStorage.setItem('apiHostURL.arizon', document.getElementById("apiHostInput.arizon").value);
            window.location.reload()
        },
        recordingStart: function () {
            let apiHostURL = { kinect: localStorage.getItem('apiHostURL.kinect'), arizon: localStorage.getItem('apiHostURL.arizon') }
            let recordingTag = document.getElementById("recordingTag").value

            // start Azure Kinect DK
            if (!checkAPIHost(apiHostURL.kinect)) {
                this.$message.error("APIHostURL.kinect not defined")
            } else {
                let azureTargetURL = new URL('/v1/azure/start', apiHostURL.kinect).href
                azureTargetURL = azureTargetURL + "?tag=" + recordingTag
                try {
                    axios.post(azureTargetURL).then(response => {
                        if (response.status === 200) {
                            // console.log(JSON.stringify(response.data, null, "    "))
                            this.recordingResponse.kinect = response.data
                        } else {
                            this.recordingResponse.kinect = {}
                            this.$message.error("Server Error")
                        }
                    })
                } catch (err) {
                    this.$message.error(err)
                }
            }

            if (this.toggleForce) {
                // start Arizon Force Sensor
                if (!checkAPIHost(apiHostURL.arizon)) {
                    this.$message.error("APIHostURL.arizon not defined")
                } else {
                    let arizonTargetURL = new URL('/v1/arizon/start', apiHostURL.arizon).href
                    arizonTargetURL = arizonTargetURL + "?tag=" + recordingTag
                    try {
                        axios.post(arizonTargetURL).then(response => {
                            if (response.status === 200) {
                                // console.log(JSON.stringify(response.data, null, "    "))
                                this.recordingResponse.kinect = response.data
                            } else {
                                this.recordingResponse.kinect = {}
                                this.$message.error("Server Error")
                            }
                        })
                    } catch (err) {
                        this.$message.error(err)
                    }
                }
            }

        },
        recordingStop: function () {
            let apiHostURL = { kinect: localStorage.getItem('apiHostURL.kinect'), arizon: localStorage.getItem('apiHostURL.arizon') }

            if (!checkAPIHost(apiHostURL.kinect)) {
                this.$message.error("APIHostURL.kinect not defined")
            } else {
                let azureTargetURL = new URL('/v1/azure/stop', apiHostURL.kinect).href
                try {
                    axios.post(azureTargetURL).then(response => {
                        if (response.status === 200) {
                            console.log(JSON.stringify(response.data, null, "    "))
                            this.recordingResponse.kinect = response.data
                        } else {
                            this.recordingResponse.kinect = {}
                            this.$message.error("Server Error")
                        }
                    })
                } catch (err) {
                    this.$message.error(err)
                }
            }

            if (!checkAPIHost(apiHostURL.arizon)) {
                this.$message.error("APIHostURL.arizon not defined")
            } else {
                let arizonTargetURL = new URL('/v1/arizon/stop', apiHostURL.arizon).href
                try {
                    axios.post(arizonTargetURL).then(response => {
                        if (response.status === 200) {
                            console.log(JSON.stringify(response.data, null, "    "))
                            this.recordingResponse.arizon = response.data
                        } else {
                            this.recordingResponse.arizon = {}
                            this.$message.error("Server Error")
                        }
                    })
                } catch (err) {
                    this.$message.error(err)
                }
            }

        },
        refreshTag: function () {
            this.recordingTag = getDefaultTag();
        }


    },
    computed: {},
    created() {
        this.initialize()
    },
};
</script>
