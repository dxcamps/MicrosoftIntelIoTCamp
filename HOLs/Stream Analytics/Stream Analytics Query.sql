SELECT
    deviceID,
    [timestamp] as [timestamp],
    temperature
INTO
    msindb
FROM
    msiniothub

SELECT
    deviceID,
    [timestamp] as [timestamp],
    temperature
INTO
    msinevents
FROM
    msiniothub
WHERE temperature > 35   