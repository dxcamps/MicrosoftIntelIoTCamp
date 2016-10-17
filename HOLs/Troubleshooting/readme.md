# Reset Instructions 

## Re-imaing the NUC

The "**Intel IoT Gateway**" ships with a linux image already running on it.  There should also be a restorable factory image that can be used if you feel that your "**NUC**" is behaving poorly.  To do so, you'll need to have an HDMI Monitor and Keyboard attached to the NUC.  Here's how to do it:

Video: "**<a target="_blank" href="https://www.youtube.com/embed/nS6xNMGRRvg">Re-Imaging the Intel IoT Gateway NUC</a>**"

<iframe width="560" height="315" src="https://www.youtube.com/embed/nS6xNMGRRvg" frameborder="0" allowfullscreen></iframe> 

## Manual Reset

If you've messed up the "**Flow 1**", "**Blinky**" for "**Flow 3**" (Azure) flows you can import versions of the flows from the **"/Node-RED Flows**" files.  

## Manual IoT_Cloud Repository And packagegroup-cloud-azure installs (untested)

ssh into the NUC and run the following commands:

```text
smart channel --add 'IoT_Cloud' type=rpm-md baseurl=http://iotdk.intel.com/repos/iot-cloud/wrlinux7/rcpl13 -y
smart update 'IoT_Cloud'
smart update
smart install -y packagegroup-cloud-azure
systemctl restart node-red-experience
```