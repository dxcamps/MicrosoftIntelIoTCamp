using System;
using Newtonsoft.Json;
using Microsoft.Azure.Devices;
using System.Text;

// The EventHubMessage class will be used to deserialize 
// the incoming event hub message into a .net object 
// we can easily access the properties on
class EventHubMessage {
    public string deviceid { get; set;}
    public DateTime timestamp {get; set;}
    public float temperature {get; set;}
}

// The AlertMessage class will be used to create the 
// alert message that will be sent to the device.  
// It will be deserialized into json and sent 
// to the device as a cloud-to-device message via the 
// Azure IoT Hub
class AlertMessage {
    public string type {get; set;}
    public string message {get; set;}
}

// In the portal, open up the IoT Hub, then "Shared Access Policies" and copy the primary connection string
// for the "service" access policy and paste it in below
static string connectionString = "<Your IoT Hub 'service' SAS Policy Primary Connection String goes here>";

// This is the Azure IoT Hub client. 
// We'll use it to send an alert message to the device
static ServiceClient serviceClient;

public static async void Run(string myEventHubMessage, TraceWriter log)
{
    try
    {
        //Log the incoming message to the console. 
        //You can see these log messages in the Azure Portal on the "Develop" page for your function
        log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");

        //Get the incoming JSON message from the event jub and deserialize it into
        //an instance of the EventHubMessage class we defined above.
        EventHubMessage eventHubMessage = JsonConvert.DeserializeObject<EventHubMessage>(myEventHubMessage);      

        //More log messages, just helps you debug this function in the portal
        log.Info($"deviceid: {eventHubMessage.deviceid}");
        log.Info($"timestamp: {eventHubMessage.timestamp}");
        log.Info($"temperature: {eventHubMessage.temperature}");

        //Connect to the Azure IoT Hub using the connection string you provided above.
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

        //Generate the cloud-to-device message that will be sent down to the 
        //Intel NUC via the Azure IoT Hub.  The Node-RED flow we develop on the NUC
        //will receive this message, sound the buzzer and display the "message" text on the LCD
        AlertMessage alertMessage = new AlertMessage() {
            type = "temp",
            message=$"Temp Alert: {eventHubMessage.temperature}"
        };

        //Deserialize the alertMessage into JSON
        string alertMessageJson = JsonConvert.SerializeObject(alertMessage);
        //Get the message bytes
        var alertMessageBytes = Encoding.ASCII.GetBytes(alertMessageJson);
        //Create an IoT Hub Microsoft.Azure.Devices with our data in it
        var cloudToDeviceMessage = new Message(alertMessageBytes);
        
        //Finally, Use the IoT Hub service client to send the cloud-to-device message asynchronously  
        await serviceClient.SendAsync(eventHubMessage.deviceid, cloudToDeviceMessage);
        }
    catch (System.Exception ex)
    {
        //Log any errors that occurred.
        string errmsg = $"An {ex.GetType().Name} exception occurred. {ex.Message}";
        log.Info(errmsg);
    }
}
