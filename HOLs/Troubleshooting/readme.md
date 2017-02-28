# Troubleshooting Steps and Fixes

- [Fixing the WiFi / Ethernet IP Address conflict on the NUC - The Easy Way](#networkconflict)
- [Re-imaging the NUC](#reimaging)
- [Fixing Node-Red Flows](fixingflows)
- [Manual IoT_Cloud Repository And packagegroup-cloud-azure installs with RPM](#manualinstalls)
- [Manual Node-Red AzureIoTHub node installation using NPM instead of RPM](#manualnodered)
- [powerbi-cli Issues](#powerbicli)
- [IP Address not Displaying on the Grove LCD](#noiponlcd)

---

<a name="networkconflict"></a>

## Fixing the WiFi / Ethernet IP Address conflict on the NUC - The Easy Way:

### The problem

If you have a NUC with an internal WiFi card installed, the image on the NUC likely has that WiFi adapter's IP Address statically set as:


| IP Address    | Subnet Mask     |
| ------------- | --------------- |
| `192.168.1.1` | `255.255.255.0` |

The above IP Address / Subnet Mask implies tht the WiFi network the NUC hosts is:

`192.168.1.0/24`

That isn't a problem unless the Venue that you are at is also using the `192.168.1.0/24` network (a very common network for consumer routers to default to).  If the venue is using that network, and you connect the NUC's ethernet port to it, the NUC gets confused because it sees two separate `192.168.1.0/24` networks.  One on it's WiFi adapter and another on it's Ethernet adapter.

![IP Network Conflict Problem](images/IpNetworkConflictProblem.png)

The easiest way to fix the problem is to simply re-assign the Static IP Address on the NUC's WiFi adapter so that it is on a different network:

![IP Network Conflict Solution](images/IpNetworkConflictSolution.png)


The easiest way to resolve the problem is:

1. Connect an HDMI Monitor, Keyboard and Mouse directly to the NUC, and power the NUC up:

    ![Monitor and Keyboard on NUC](images/NUCWithMonitorAndKeyboard.png)

1. Using the keyboard, login to the NUC as the user `root` with the password `root`:

    ```bash
    WR-IDP-5188 login: root
    Password: root
    ```

4. From the command line, list the /etc/config/file:

    ```bash
    cat /etc/config/network
    ```

    Find the `lan` interface's `ipaddr` (IP Address) in the output (`192.168.1.1` below):

    ```bash
    ...

    config interface 'lan'
            option ifname 'wlan0'
            option type 'bridge'
            option proto 'static'
            option ipaddr '192.168.1.1'
            option netmask '255.255.255.0'

    ...
    ```
5. Decide on the new IP Address you wish to use.  We recommend using `192.168.101.1` and keeping the subnet mask at `255.255.255.0`.  This will put the NUC's WiFi adapter on the `192.168.101.0/24` network.  You can use whatever you wish, we'll assume the `192.168.101.1` network address.

6. If you are only changing the WiFi adapter's IP Address, and not it's subnet mask, you can do it easily using the `sed` (stream editor) utility.  Following is an example of changing the `192.168.1.1` ip address to `192.168.101.1`.

    > **Note**: We are using the Linux `sed` (Stream Editor) to make quick work of the editing, however if you have multiple changes to make, or prefer to use an editor, you can use the `vi` editor installed on the NUC or use `apt-get` to install another editor.  We won't document those steps here though.

    ```bash
    sudo sed -i 's/192.168.1.1/192.168.101.1/g' /etc/config/network
    ```

7. Verify the change by re-examining the /etc/config/network file:

    ```bash
    cat /etc/config/network
    ```

    With the output now showing the `192.168.101.1` as the `ipaddr`:

    ```bash
    ...

    config interface 'lan'
            option ifname 'wlan0'
            option type 'bridge'
            option proto 'static'
            option ipaddr '192.168.101.1'
            option netmask '255.255.255.0'

    ...
    ```

8. If everything looks good, reboot the NUC:

    ```bash
    sudo shutdown -r 0
    ```

9. Wait until it reboots, and verify that you can now connect to it over ethernet as expected. 

---

<a name="reimaging"></a>

## Re-imaging the NUC

The "**Intel IoT Gateway**" ships with a linux image already running on it.  There should also be a restorable factory image that can be used if you feel that your "**NUC**" is behaving poorly.  To do so, you'll need to have an HDMI Monitor and Keyboard attached to the NUC.  Here's how to do it:

Video: "**<a target="_blank" href="https://www.youtube.com/embed/nS6xNMGRRvg">Re-Imaging the Intel IoT Gateway NUC</a>**"

<iframe width="560" height="315" src="https://www.youtube.com/embed/nS6xNMGRRvg" frameborder="0" allowfullscreen></iframe> 

---

<a name="fixingflows"></a>

## Fixing Node-Red Flows

If you've messed up the "**Flow 1**", "**Blinky**" for "**Flow 3**" (Azure) flows you can import versions of the flows from the **"/Node-RED Flows**" files.  

---

<a name="manualinstalls"></a>

## Manual IoT_Cloud Repository And packagegroup-cloud-azure installs with RPM

ssh into the NUC and run the following commands:

```text
rpm --import http://iotdk.intel.com/misc/iot_pub.key
rpm --import http://iotdk.intel.com/misc/iot_pub2.key
npm install node-red-contrib-os -g
smart channel --add 'IoT_Cloud' type=rpm-md baseurl=http://iotdk.intel.com/repos/iot-cloud/wrlinux7/rcpl13 -y
smart update 'IoT_Cloud'
smart update
smart install -y packagegroup-cloud-azure
systemctl restart node-red-experience
```

---

<a name="manualnodered"></a>

## Manual Node-Red AzureIoTHub node installation using NPM instead of RPM

ssh into the NUC and run the following commands:

> **Note**: Make sure to include the `@0.0.1` version specifier on the `node-red-contrib-azureiothubnode` installation.  That will make sure that you install the version this lab was documented against. 

```text
rpm --import http://iotdk.intel.com/misc/iot_pub.key
npm install node-red-contrib-os -g
npm install -g node-red-contrib-azureiothubnode@0.0.1
systemctl restart node-red-experience
```

---

<a name="powerbicli"></a>

## powerbi-cli Issues

The powerbi-cli command line tool has had some issues lately.

### Issues on Linux, OSX, and Bash on Ubuntu on Windows

The cli has some installation issues it seems in linux environments.  The powerbi-cli team is aware of them, but they does not appear to have been resolved yet.

For example, when you run:

`powerbi config`

You may receive an error like:

`powerbi-config(1) does not exist, try --help`

The problem appears to be related to how the client finds it's submodules.  As a workaround, you can attempt the steps documented on the powerbi-cli's github Issues page: [Microsoft/PowerBI-Cli#5 (comment)](https://github.com/Microsoft/PowerBI-Cli/issues/5#issuecomment-251419579)

### Issues Updating the Database Connection String

The `powerbi update-connection` command was broken in some recent versions of the powerbi-cli.

The command would return results like the following:

```
[ powerbi ] Found dataset!
[ powerbi ] Id: 1667a811-f8bb-4792-a719-07adc5d244e2
[ powerbi ] Name: TempChart
[ powerbi ] Updating connection string...
[ powerbi ] parameters[valueElement] must be of type object.
[ powerbi ] Connection string successfully updated

...

[ powerbi ] Successfully updated datasource credentials!
[ powerbi ] Datasource ID:  9dc4fe4d-d620-4910-a069-6c20e0b8837a
[ powerbi ] Gateway ID:  627fa205-99de-4f50-aaf8-484838be30f6
```

Even though it LOOKS like it updated there is one line in the output that reads:

```bash
[ powerbi ] parameters[valueElement] must be of type object.
```

That is actually an error, and you will find that the connection string didn't actually update.  To fix the problem, make sure you are running powerbi-cli version 1.0.8 or later.

***Even if you already have v1.0.8 installed you should RE-INSTALL to make sure you have the latest bits.  The team make some fixes, but they were re-released on the same version number***

1. To check the version of the powerbi-cli you can run the following command:

    ```bash
    powerbi --version
    ```

    Make sure you get v1.0.8 or later as a result:

    ```bash
    1.0.8
    ```

1. To re-install to the latest version of the powerbi-cli:

    ```bash
    npm insatll -g powerbi-cli
    ```

---

<a name="noiponlcd"></a>

## IP Address not Displaying on the Grove LCD

When you boot, the NUC with the Arduino 101, Grove Shield, Rotary Sesor, LCD and Ethernet attached you should see your NUC's IP Address display on the LCD. This is because the default Node-Red Flow on the NUC is reading the IP Address off of the `eth0` (Ethernet) interface, and displaying it on the LCD for you.  However, if you are NOT seeing the IP Address display check the following:

1. First, ensure that the Arduino 101, Grove Shield, Rotary Sensor and LCD were assembled correctly as documented in the lab in int [Getting Started with Grove IoT Commercial Developer Kit](../readme.md#GettingStartedWithGrove) section.

1. Ensure that you set the voltage switch on the Grove Shield as documented in the lab:

    ![Base Sheild set to 5V](../images/01040-BaseShield5V.png)

1. Make sure that the Arduino 101 is connected to the NUC's USB port ***BEFORE*** you power the NUC on to boot it.  

    > **Note**: Why?  The NUC communicates with the Arduino 101 using a serial communication framework called "Firmata".  When the NUC boots, it checks to see if it has an Arduino 101 installed and if it does, it flashes the Arduino 101 with the Firmata firmware.  If you attache the Arduino 101 AFTER the NUC has booted, it may not have received the Firmata firmware.

1. One way to test that the Firmata is working, etc. is to twist the rotary sensor.  You should see that the background color of the RGB LCD attached to the Grove Shield changes.  This is implemented in the default Node-Red flow on the NUC and it wouldn't work if the NUC couldn't communicate with the Arduino 101.  So if that works, at least you know the NUC / Node-Red / Arduino 101 / Grove Shield stack is working.  

1. You should also be able to see the current values of the rotary sensor in the Intel Dev Hub on the NUC at `http://<your.nucs.ip.address>`.  Again, this is just to help you confirm that the communication between your NUC and the Arduino 101 is working so you can continue to diagnose the issue of the IP Address not displaying.