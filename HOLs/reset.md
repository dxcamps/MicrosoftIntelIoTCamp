Reset Instructions 
==================

The following commands will help you reset the so that you can repeat the lab steps.  

1. In the Node-RED interface on the NUC [http://your.nuc.ip.address:1880](http://your.nuc.ip.address:1880), delete the flows you created during the lab:
     - Flow 2 - The one where you blinked the LED
     - Flow 3 - Where we published the sensor data to Azure IoT Hubs

2. Make sure only one flow exists name "Flow 1".  Reset Flow 1 to the default Flow code:

    > Note: The code for default "Flow 1" can also be found in the [flow1.json](Node-RED Flows/flow1.json) file in this repo.

    ```JSON
    [
        {
            "id": "d0c7d782.a2b7f8",
            "type": "mqtt-broker",
            "z": "",
            "broker": "localhost",
            "port": "1883",
            "clientid": "",
            "usetls": false,
            "verifyservercert": true,
            "compatmode": true,
            "keepalive": "60",
            "cleansession": true,
            "willTopic": "",
            "willQos": "0",
            "willRetain": null,
            "willPayload": "",
            "birthTopic": "",
            "birthQos": "0",
            "birthRetain": null,
            "birthPayload": ""
        },
        {
            "id": "72745c67.5ea434",
            "type": "function",
            "z": "f9e23d29.a970f",
            "name": "changeColor",
            "func": "\nif (msg.payload >= 0 && msg.payload <= 78){\n    //red\n    msg.lcdColor = {r: 255, g: 0, b: 0};\n}\nelse if (msg.payload > 78 && msg.payload <= 156){\n    //orange\n    msg.lcdColor = {r: 255, g: 128, b: 0};\n}\nelse if (msg.payload > 156 && msg.payload <= 234){\n    //yellow\n    msg.lcdColor = {r: 255, g: 255, b: 0};\n}\nelse if (msg.payload > 234 && msg.payload <= 312){\n    //red-green\n    msg.lcdColor = {r: 128, g: 255, b: 0};\n}\nelse if (msg.payload > 312 && msg.payload <= 390){\n    //green\n    msg.lcdColor = {r: 0, g: 255, b: 0};\n}\nelse if (msg.payload > 390 && msg.payload <= 468){\n    //blue-green\n    msg.lcdColor = {r: 0, g: 255, b: 128};\n}\nelse if (msg.payload > 468 && msg.payload <= 546){\n    //green-blue\n    msg.lcdColor = {r: 0, g: 255, b: 255};\n}\nelse if (msg.payload > 546 && msg.payload <= 624){\n    //light-blue\n    msg.lcdColor = {r: 0, g: 128, b: 255};\n}\nelse if (msg.payload > 624 && msg.payload <= 702){\n    //blue\n    msg.lcdColor = {r: 0, g: 0, b: 255};\n}\nelse if (msg.payload > 702 && msg.payload <= 780){\n    //purple\n    msg.lcdColor = {r: 127, g: 0, b: 255};\n}\nelse if (msg.payload > 780 && msg.payload <= 858){\n    //pink-purple\n    msg.lcdColor = {r: 255, g: 0, b: 255};\n}\nelse if (msg.payload > 858 && msg.payload <= 936){\n    //pink\n    msg.lcdColor = {r: 255, g: 0, b: 127};\n}\nelse if (msg.payload > 936 && msg.payload <= 1023){\n    //gray\n    msg.lcdColor = {r: 128, g: 128, b: 128};\n}\n\n//don't display rotary value on lcd\nmsg.lcdCursor = {row: 1, column: 0};\nmsg.payload = '';\n\nreturn msg;",
            "outputs": 1,
            "noerr": 0,
            "x": 285.09234619140625,
            "y": 170.09091186523438,
            "wires": [
                [
                    "f2047f7.382f58"
                ]
            ]
        },
        {
            "id": "ac9b0c14.85875",
            "type": "exec",
            "z": "f9e23d29.a970f",
            "command": "ifconfig eth0 | grep \"inet addr\" | awk -F: '{print$2}' | awk '{printf \"%s\", $1}'",
            "addpay": false,
            "append": "",
            "useSpawn": "",
            "name": "getIP",
            "x": 282.09234619140625,
            "y": 113.59091186523438,
            "wires": [
                [
                    "f2047f7.382f58"
                ],
                [],
                []
            ]
        },
        {
            "id": "ba67aefc.4aec6",
            "type": "inject",
            "z": "f9e23d29.a970f",
            "name": "updateIP",
            "topic": "ip",
            "payload": "",
            "payloadType": "num",
            "repeat": "60",
            "crontab": "",
            "once": true,
            "x": 117.09234619140625,
            "y": 114.09091186523438,
            "wires": [
                [
                    "ac9b0c14.85875"
                ]
            ]
        },
        {
            "id": "268139d0.3b6626",
            "type": "chart tag",
            "z": "f9e23d29.a970f",
            "title": "Rotary",
            "chartType": "line",
            "dataSource": "Line",
            "units": "Raw",
            "min": "0",
            "max": "1023",
            "targetLow": "",
            "targetHigh": "",
            "priority": "",
            "sourcePriority": "1",
            "ttl": "3",
            "points": 50,
            "x": 284.09234619140625,
            "y": 219.09091186523438,
            "wires": [
                [
                    "96d4b3e6.64672"
                ]
            ]
        },
        {
            "id": "53fde350.8833ac",
            "type": "chart tag",
            "z": "f9e23d29.a970f",
            "title": "Rotary",
            "chartType": "gauge",
            "dataSource": "Gauge",
            "units": "",
            "min": "0",
            "max": "1023",
            "targetLow": "",
            "targetHigh": "",
            "priority": "",
            "sourcePriority": "2",
            "ttl": "3",
            "points": 50,
            "x": 285.09234619140625,
            "y": 264.0909118652344,
            "wires": [
                [
                    "96d4b3e6.64672"
                ]
            ]
        },
        {
            "id": "69e85a89.f34e14",
            "type": "upm-grove-rotary",
            "z": "f9e23d29.a970f",
            "name": "",
            "platform": "512",
            "unit": "ABSRAW",
            "pin": "0",
            "interval": 1000,
            "x": 111.09234619140625,
            "y": 201.09091186523438,
            "wires": [
                [
                    "72745c67.5ea434",
                    "268139d0.3b6626",
                    "53fde350.8833ac",
                    "30fd1d52.f08e62"
                ]
            ]
        },
        {
            "id": "f2047f7.382f58",
            "type": "upm-grove-rgb-lcd",
            "z": "f9e23d29.a970f",
            "name": "",
            "platform": "512",
            "r": 0,
            "g": 0,
            "b": 255,
            "row": 0,
            "column": 0,
            "x": 483.09234619140625,
            "y": 100.09091186523438,
            "wires": []
        },
        {
            "id": "96d4b3e6.64672",
            "type": "mqtt out",
            "z": "f9e23d29.a970f",
            "name": "Charts",
            "topic": "/sensors",
            "qos": "",
            "retain": "",
            "broker": "d0c7d782.a2b7f8",
            "x": 451.09234619140625,
            "y": 239.09091186523438,
            "wires": []
        },
        {
            "id": "30fd1d52.f08e62",
            "type": "debug",
            "z": "f9e23d29.a970f",
            "name": "",
            "active": false,
            "console": "false",
            "complete": "false",
            "x": 266.9517059326172,
            "y": 378.8053894042969,
            "wires": []
        }
    ]
    ```
3. In the NUC portal, on the "Packages" page:

    > **Note**: The "packagegroup-cloud-azure" package is defined here: https://github.com/intel-iot-devkit/meta-iot-cloud/blob/master/recipes-core/packagegroups/packagegroup-cloud-azure_0.9.bb

    > **Note**: The URL for the IoT_Cloud repository is: http://iotdk.intel.com/repos/iot-cloud/wrlinux7/rcpl13

    - Delete packagegroup-cloud-azure package
    - Delete IoT_Cloud repository

4. ssh (PuTTY, screens, ssh) into the NUC.  From the terminal run:   

    ```bash
    # This removes the public key imported from http://iotdk.intel.com/misc/iot_pub.key
    rpm -e --allmatches gpg-pubkey-e26c791f-56b460db

    # You can verify that the public key was removed with the following rpm query:
    # This should return a response like:
    # package gpg-pubkey-e26c791f-56b460db is not installed
    rpm -q gpg-pubkey-e26c791f-56b460db

    # Remove the Node-Red nodes for obtaining cpu system information.
    npm uninstall node-red-contrib-os –g 

    # Remove the Azure IoT Hub Node-RED node implemention
    npm uninstall node-red-contrib-auzreiothubnode -g

    # Restart the Node-RED experience.  
    # You will need to re-connect to the Node-RED environment after this command. 
    systemctl restart node-red-experience
    ```
5. Finally, I had a problem when trying to re-install the packagegroup-cloud-azure package after removing it using these steps.  I had to reboot the NUC. Not sure if I was just experiencing a fluke or if this is truly necessary, but it probably wouln't hurt to reset the NUC before trying to complete the lab steps again:

    ````bash
    # Reboot the NUC
    shutdown 0 -r
    ````

