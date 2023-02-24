<template>
    <div>
        <v-container>

            <v-card class="mx-auto  my-4">
                <v-list-item three-line>
                    <v-list-item-content>
                        <v-list-item-title class="headline mb-1">Time QR Code</v-list-item-title>
                        <v-list-item-subtitle>Capture a short clip before each session on master camera.
                        </v-list-item-subtitle>
                        <v-container fluid align-center>

                            <v-container id="QRContainer">
                                <v-row align="center"
                                       justify="center">
                                    <canvas id="timeCanvas"></canvas>
                                </v-row>
                            </v-container>

                            <v-row align="center"
                                   justify="center">
                                <v-card-text class="text-h5 text-center">
                                    <label id="timeString"></label>
                                </v-card-text>
                            </v-row>
                        </v-container>


                        <v-layout align-center justify-center>

                            <v-container>

                            </v-container>

                        </v-layout>


                    </v-list-item-content>
                </v-list-item>
                <v-card-actions>

                    <v-btn text class="mt-4" @click="refresh()" color="success">Refresh</v-btn>

                    <v-btn text class="mt-4" @click="repeat()">Toggle</v-btn>

                </v-card-actions>
            </v-card>

        </v-container>
    </div>
</template>

<script>

var go = null;
var QRCode = require('qrcode')

function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function min(x, y) {
    if (x > y) {
        return y;
    } else {
        return x;
    }
}

function generate() {
    var dt = new Date();
    var str =  pad(dt.getUTCFullYear(), 4) + '-' + pad(dt.getUTCMonth() + 1, 2) + '-' + pad(dt.getUTCDate(), 2) + '_' + pad(dt.getUTCHours(), 2) + ':' + pad(dt.getUTCMinutes(), 2) + ":" + pad(dt.getUTCSeconds(), 2) + "." + pad(dt.getUTCMilliseconds(), 3);
    var container = document.getElementById('QRContainer')
    var canvas = document.getElementById('timeCanvas')
    // canvas.height = container.offsetWidth;
    QRCode.toCanvas(canvas, str, {
        margin: 1,
        height: min(container.offsetWidth, 512),
        width: min(container.offsetWidth, 512),
    })
    // QRCode.toCanvas(canvas, str, function (error) {
    //     if (error) console.error(error)
    //     console.log('success!');
    // })
    document.getElementById('timeString').innerText = 'GMT: ' + str;
    return true;
}

export default {
    name: "Sync",
    data: () => ({}),
    mounted: function () {
        this.setGlobalTitle();
        generate();
    },
    methods: {
        initialize() {

        },
        setGlobalTitle: function () {
            var myElement = document.getElementById("global-title");
            myElement.textContent = "Sync";
        },
        repeat: function () {
            if (go === null) {
                go = window.setInterval(generate, 500);
            } else {
                window.clearInterval(go);
                go = null;
            }

        },
        refresh: function () {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    generate();
                }, i * 500);
            }
        }

    },
    computed: {},
    created() {
        this.initialize()
    },
};
</script>
