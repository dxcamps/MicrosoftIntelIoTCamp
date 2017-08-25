'use strict';

// ============== Use nconf to read config.json ===============

// nconf require
var nconf = require('nconf');

// Read in the settings specified in the config.json file
nconf.argv().env().file('./config.json');

// ==================== Azure IoT HuB Prep ====================

// Azure Iot Hub related requires
var ServiceClient = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

// Azure iot hub configuraiton values
// the iotHubConnectionString value should be the iot hubs 
// "service" SAS policy connection string, or  
// the connection string for any other policy that has "send" 
// permissions on the iot hub.  
var iotHubConnString = nconf.get('iotHubConnString');

// Setup the iot hub connection 
var iotHubClient = ServiceClient.fromConnectionString(iotHubConnString);

// ==================== SQL Server Client Prep ====================

// tedious (aka TDS => "Tabular Data Stream") 
// SQL Server client related requires
var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

// SQL Server connection configuration values
var sqlServer = nconf.get('sqlServer');
var sqlDatabase = nconf.get('sqlDatabase');
var sqlLogin = nconf.get('sqlLogin');
var sqlPassword = nconf.get('sqlPassword');

// Setup the tedious connection pool
var sqlPoolConfig = {
    min: 2, 
    max: 4,
    log: true
};

// Set the tedious sql connection details
var sqlConnectionConfig = {  
    userName: sqlLogin + '@' + sqlServer,  
    password: sqlPassword,  
    server: sqlServer,  
    // When you connect to Azure SQL Database, you need these next options.  
    options: {encrypt: true, database: sqlDatabase, rowCollectionOnDone: true} 
};

// Create the tedious sql client connection pool.
var sqlPool = new ConnectionPool(sqlPoolConfig, sqlConnectionConfig);

// Configure the tedious connection pool to just log any pool level
// errors to the console. 
sqlPool.on('error',function(err){
        console.log("Pool Error!:\n" + err);
        return;
});


function runQuery(res, query) {
    sqlPool.acquire(function(err,poolConnection){
        if(err){
            console.log("An error occurred acquiring a pool connection:\n " + err);
            res.json({ "error": err});
            return;
        }

        var sqlRequest = new Request(query, 
            function(err) {  
                if (err) {
                    console.log('An error occurred when executing the sql request:\n' + err);
                    res.json({ "error": err});
                }
            });  
        var result = "";  
        sqlRequest.on('doneInProc', function(rowCount, more, rows) {
            res.json(rows);  
            console.log('doneInProc: ' + rowCount + ' rows returned');
            console.log(rows.length);  
            rows.forEach(function(row){
            row.forEach(function(column) {  
                if (column.value === null) {  
                console.log('NULL');  
                } else {  
                result+= column.value + " ";  
                }  
            });  
            console.log(result);  
            result ="";  
            });
            poolConnection.release();
        });  

        poolConnection.execSql(sqlRequest);  
    });
}

// =================== Express Web App Prep ===================

// General express related requires...
var express = require('express');
var bodyParser = require('body-parser');

// website setup
var app = express();
var localport = nconf.get('localport');
var port = normalizePort(process.env.PORT || localport);
app.set('port', port)
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.json());

// Used to retrieve just the last measurement for each device 
// in the dbo.Measurements table in the database.
app.get('/api/devices', function(req, res) {
    console.log('Retrieving devices with their last measurement');
    var query="select deviceid, [timestamp], temperature from dbo.Devices;";
    runQuery(res, query);
});

app.get('/api/recent', function(req, res) {
    console.log('Retrieving recent measurments from sql');
    var query="select deviceid, [timestamp], temperature from dbo.RecentMeasurements;";
    runQuery(res, query);
});

app.post('/api/testBuzzer', function(req, res) {

    var deviceid = req.body.deviceid;

    console.log('Sending buzzer test alert to ' + deviceid);

    iotHubClient.open(function(err) {
        if (err) {
            console.error('Could not connect: ' + err.message);
        } else { 
            var data = JSON.stringify({ "type": "temp","message": "Buzzer Test     " });
            var message = new Message (data);
            console.log('Sending message: ' + data);
            iotHubClient.send(deviceid, message, printResultFor('send'));
            console.log('Async message sent');
        }
    });

    // Helper function to print results in the console
    function printResultFor(op) {
        return function printResult(err, res) {
            if (err) {
                console.log(op + ' error: ' + err.toString());
            } else {
                console.log(op + ' status: ' + res.constructor.name);
            }
        };
    }


    res.end();
});

app.listen(port, function() {
    console.log('app running on http://localhost:' + port);
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}



    
