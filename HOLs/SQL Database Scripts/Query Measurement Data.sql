-- Query the dbo.Measurement table
-- This table contains ALL measurements received
-- via the IoT Hub and Stream Analytics JOb
select * from dbo.Measurement;

-- Query the dbo.RecentMeasurements view
-- This view returns just the top 20 most
-- recent records in the dbo.Measurement table
select * from dbo.RecentMeasurements;

-- Query the dbo.Devices view.  
-- This view shows a row for each device id
-- found in the table along with their latest
-- temprature reading and timestamp  
select * from dbo.Devices;