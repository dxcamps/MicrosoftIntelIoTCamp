# Troubleshooting Steps and Fixes

- [Fixing the WiFi / Ethernet IP Address conflict on the NUC - The Easy Way](#networkconflict)
- [Re-imaging the NUC](#reimaging)
- [Fixing Node-Red Flows](fixingflows)
- [Manual IoT_Cloud Repository And packagegroup-cloud-azure installs with RPM](#manualinstalls)
- [Manual Node-Red AzureIoTHub node installation using NPM instead of RPM](#manualnodered)
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

![IP Network Conflict Problem](images/IPNetworkConflictProblem.png)

The easiest way to fix the problem is to simply re-assign the Static IP Address on the NUC's WiFi adapter so that it is on a different network:

![IP Network Conflict Solution](images/IPNetworkConflictSolution.png)


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

    > **Note**: If you have multiple changes to make, or prefer to use an editor, you can use the `vi` editor installed on the NUC or use `apt-get` to install another editor.  We won't document those steps here though.

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
