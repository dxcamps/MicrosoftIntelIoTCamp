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
    deviceID nvarchar(15) not null
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
select top 20 * from dbo.Measurement order by [timestamp] desc;
select count(*) from dbo.Measurement
go
--truncate table dbo.Measurement;
