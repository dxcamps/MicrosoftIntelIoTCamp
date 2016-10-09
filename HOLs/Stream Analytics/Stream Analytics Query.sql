SELECT
    deviceID,
    [timestamp] as [timestamp],
    temperature
INTO
    sqldb
FROM
    iothub

SELECT
    deviceID,
    [timestamp] as [timestamp],
    temperature
INTO
    alerts
FROM
    iothub
WHERE temperature > 40  