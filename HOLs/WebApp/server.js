'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var nconf = require('nconf');

var ServiceClient = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

nconf.argv().env().file('./config.json');
var eventHubName = nconf.get('eventHubName');
var ehConnString = nconf.get('ehConnString');
var iotHubConnString = nconf.get('iotHubConnString');
var deviceId = nconf.get('deviceId');
var sqlServer = nconf.get('sqlServer');
var sqlDatabase = nconf.get('sqlDatabase');
var sqlLogin = nconf.get('sqlLogin');
var sqlPassword = nconf.get('sqlPassword');

var sqlPoolConfig = {
    min: 2, 
    max: 4,
    log: true
};

var sqlConnectionConfig = {  
    userName: sqlLogin + '@' + sqlServer,  
    password: sqlPassword,  
    server: sqlServer,  
    // When you connect to Azure SQL Database, you need these next options.  
    options: {encrypt: true, database: sqlDatabase, rowCollectionOnDone: true} 
};

var sqlPool = new ConnectionPool(sqlPoolConfig, sqlConnectionConfig);

sqlPool.on('error',function(err){
        console.log("Pool Error!:\n" + err);
        return;
});

var iotHubClient = ServiceClient.fromConnectionString(iotHubConnString);

// website setup
var app = express();
//Shouldn't get port from the config.json
var localport = nconf.get('localport');
var port = normalizePort(process.env.PORT || localport);
app.set('port', port)
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.json());

// app api
app.get('/api/alerts', function(req, res) {
    res.json(alerts);
});

app.get('/api/temperatures', function(req, res) {
    sqlPool.acquire(function(err,poolConnection){
        if(err){
            console.log("An error occurred acquiring a pool connection:\n " + err);
            res.json({ "error": err});
            return;
        }

        var sqlRequest = new Request("SELECT TOP 10 deviceid, timestamp, temperature FROM dbo.Measurement as m ORDER BY m.[timestamp] DESC;", 
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
})

var completedCallback = function(err, res) {
    if (err) { console.log(err); }
    else { console.log(res); }
};

app.post('/api/command', function(req, res) {

    var command = req.body.command;

    console.log('command received: ' + command);

    if(command=='TestBuzzer'){

        console.log('Sending buzzer test alert');

        iotHubClient.open(function(err) {
            if (err) {
                console.error('Could not connect: ' + err.message);
            } else { 
                var data = JSON.stringify({ "type": "temp","message": "Buzzer Test     " });
                var message = new Message (data);
                console.log('Sending message: ' + data);
                iotHubClient.send(deviceId, message, printResultFor('send'));
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

    };

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