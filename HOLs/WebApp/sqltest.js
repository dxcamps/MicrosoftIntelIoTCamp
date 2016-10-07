var ConnectionPool = require('tedious-connection-pool');
//var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;   

var sqlPoolConfig = {
    min: 2, 
    max: 4,
    log: true
};

var sqlConnectionConfig = {  
    userName: 'sqladmin@msinsql',  
    password: 'Pa$$w0rd',  
    server: 'msinsql.database.windows.net',  
    // When you connect to Azure SQL Database, you need these next options.  
    options: {encrypt: true, database: 'msindb', rowCollectionOnDone: true} 
};

var sqlPool = new ConnectionPool(sqlPoolConfig, sqlConnectionConfig);

sqlPool.on('error',function(err){
        console.log("Pool Error!:\n" + err);
        return;
});



// //var sqlConnection = new Connection(sqlConnectionConfig);  
// sqlConnection.on('connect', function(err) {  
//     if(err){
//         console.log("An error occurred opening the sql connection:\n " + err);
//         return;
//     }
//     console.log("Connected");  
//     executeStatement();  
// });

// sqlConnection.on('end',function(err){
//     if(err){
//         console.log("An error occured when closing the connection:\n" + err);
//         return;
//     }
//     console.log('Connection closed');
// });

sqlPool.acquire(function(err,poolConnection){
    if(err){
        console.log("An error occurred acquiring a pool connection:\n " + err);
        return;
    }

    executeStatement(connection);
});


function executeStatement(poolConnection) {  
    sqlRequest = new Request("SELECT TOP 10 deviceid, timestamp, temperature FROM dbo.Measurement as m ORDER BY m.[timestamp] DESC;", function(err) {  
    if (err) {
        console.log('An error occurred when executing the sql request:\n' + err);}  
    });  
    var result = "";  
    sqlRequest.on('row', function(columns) {  
        // columns.forEach(function(column) {  
        //   if (column.value === null) {  
        //     console.log('NULL');  
        //   } else {  
        //     result+= column.value + " ";  
        //   }  
        // });  
        // console.log(result);  
        // result ="";  
    });  

    // request.on('done', function(rowCount, more) {  
    //   console.log('done: ' + rowCount + ' rows returned');  
    // });

    // request.on('doneProc', function(rowCount, more, ) {  
    //   console.log('doneProc: ' + rowCount + ' rows returned');  
    // });  

    sqlRequest.on('doneInProc', function(rowCount, more, rows) {  
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
        sqlConnection.release();
    });  

    poolConnection.execSql(sqlRequest);  
}  