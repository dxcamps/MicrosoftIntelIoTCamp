# Reset Instructions 

## Fixing the WiFi / Ethernet IP Address conflict on the NUC:

1. From your laptop, connect to the WiFi network on the NUC: `IDPDK-XXXX` where `XXXX` is the last four digits of the NUCs WiFi MAC Address (no idea how you would find that out ahead of time):

    - SSID:  IDPDK-XXXX
    - PWD:   windriveripc

2. From your laptop, do an `ipconfig` (Windows) or an `ifconfig` (linux/mac) to determine the IP Address of the NUC. The `gateway` ip address on your laptops wireless NIC should be the IP address of the NUC's wireless network interface.

    > **Note**: Out of the box, the IP Address should be 192.168.1.1, but it's possible that it has been changed, so this step makes sure you find the actual IP Address used. 

3. From your laptop, ssh to the NUC's wireless IP address as `root`, password `root`

    ```bash
    ssh root@<your.nuc.wireless.ip>
    root
    ````

4. From the command line, list the /etc/config/file:

    ```bash
    cat /etc/config/network
    ```
5. Ensure the IP of the wireless network. 

6. Modify the IP to one that doesn't conflict with your local network:

    ```bash
    sudo sed -i 's/192.168.1.1/192.168.101.1/g' /etc/config/network
    ```

7. Verify the change by re-examining the /etc/config/network file:

    ```bash
    cat /etc/config/network
    ```

8. If everything looks good, reboot the NUC:

    ```bash
    sudo shutdown -r 
    ```

9. Wait until it reboots, and verify that you can now connect to it over ethernet as expected. 

## Re-imaging the NUC

The "**Intel IoT Gateway**" ships with a linux image already running on it.  There should also be a restorable factory image that can be used if you feel that your "**NUC**" is behaving poorly.  To do so, you'll need to have an HDMI Monitor and Keyboard attached to the NUC.  Here's how to do it:

Video: "**<a target="_blank" href="https://www.youtube.com/embed/nS6xNMGRRvg">Re-Imaging the Intel IoT Gateway NUC</a>**"

<iframe width="560" height="315" src="https://www.youtube.com/embed/nS6xNMGRRvg" frameborder="0" allowfullscreen></iframe> 

## Manual Reset

If you've messed up the "**Flow 1**", "**Blinky**" for "**Flow 3**" (Azure) flows you can import versions of the flows from the **"/Node-RED Flows**" files.  

## Manual IoT_Cloud Repository And packagegroup-cloud-azure installs with RPM

ssh into the NUC and run the following commands:

```text
rpm --import http://iotdk.intel.com/misc/iot_pub.key
npm install node-red-contrib-os -g
smart channel --add 'IoT_Cloud' type=rpm-md baseurl=http://iotdk.intel.com/repos/iot-cloud/wrlinux7/rcpl13 -y
smart update 'IoT_Cloud'
smart update
smart install -y packagegroup-cloud-azure
systemctl restart node-red-experience
```

## Manual Node-Red AzureIoTHub node installation using NPM instead of RPM

ssh into the NUC and run the following commands:

> **Note**: Make sure to include the `@0.0.1` version specifier on the `node-red-contrib-azureiothubnode` installation.  That will make sure that you install the version this lab was documented against. 

```text
rpm --import http://iotdk.intel.com/misc/iot_pub.key
npm install node-red-contrib-os -g
npm install -g node-red-contrib-azureiothubnode@0.0.1
systemctl restart node-red-experience
```
