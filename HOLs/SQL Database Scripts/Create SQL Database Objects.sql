-- Drop the dbo.Measurement table if it exists 
if exists(select object_id from sys.objects where type='U' and name = 'Measurement')
  drop table dbo.measurement;
go
-- Create the dbo.Measurement TABLE
-- this will store all the measurements received from iot hub
create table dbo.Measurement
(
    MeasurementID int IDENTITY(1,1) not null
      constraint PK_Measurement_MeasurementID 
      primary key CLUSTERED,
    deviceID nvarchar(50) not null
      constraint DF_Measurement_deviceID
      default '',
    [timestamp] datetime  null,
    temperature float(53) 
);
go
-- Query the table to ensure it EXISTS
-- the table was just created so there shouldn't
-- be any rows in it
select * from dbo.Measurement;
go
-- Drop the dbo.RecentMeasurements view if it exists 
if exists(select object_id from sys.objects where type='V' and name = 'RecentMeasurements')
  drop view dbo.RecentMeasurements;
go
-- Create the dbo.RecentMeasurements view
-- this return all recent (last 20) readings
create view dbo.RecentMeasurements as
select top 20
  deviceid,
  [timestamp],
  temperature 
from dbo.Measurement 
order by [timestamp] desc;
go
-- Query the view to make sure it works
select * from dbo.RecentMeasurements;
go
-- Drop the dbo.Devices view if it exists 
if exists(select object_id from sys.objects where type='V' and name = 'Devices')
  drop view dbo.Devices;
go
-- Create the dbo.Devices view
-- this return just the last measurement for each device
create view dbo.Devices as
select
  latest.deviceid,
  latest.[timestamp],
  latest.temperature
from measurement as latest
left join measurement as allrows
on latest.deviceid = allrows.deviceid and latest.measurementid < allrows.measurementid
where allrows.measurementid is null;
go
-- Query the view to make sure it works
select * from dbo.Devices;
go
