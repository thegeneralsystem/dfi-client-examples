# Taxi2Dfi

Designed to extract data from `.parquet` files for NYC taxi data in 2009, and send over a stream to the DFI API.

## Prerequisites

1. Download one of these Parquet files downloaded to your machine:
   - [Yellow Taxi Trip Data for 01/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-01.parquet)
   - [Yellow Taxi Trip Data for 02/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-02.parquet)
   - [Yellow Taxi Trip Data for 03/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-03.parquet)
   - [Yellow Taxi Trip Data for 04/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-04.parquet)
   - [Yellow Taxi Trip Data for 05/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-05.parquet)
   - [Yellow Taxi Trip Data for 06/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-06.parquet)
   - [Yellow Taxi Trip Data for 07/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-07.parquet)
   - [Yellow Taxi Trip Data for 08/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-08.parquet)
   - [Yellow Taxi Trip Data for 09/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-09.parquet)
   - [Yellow Taxi Trip Data for 10/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-10.parquet)
   - [Yellow Taxi Trip Data for 11/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-11.parquet)
   - [Yellow Taxi Trip Data for 12/2009](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2009-12.parquet)

## Command

```sh
npm start -- --help
```

### Example

```sh
npm start ~/Downloads/yellow_tripdata_2009-04.parquet -- -t MY_TOKEN
```

### Example - sending the first N points in the file to DFI

```sh
npm start ~/Downloads/yellow_tripdata_2009-04.parquet -- -t MY_TOKEN -p 10
```

### Example - Specifying a local instance of the DFI HTTP API

```sh
npm start ~/Downloads/yellow_tripdata_2009-04.parquet -- -t MY_TOKEN --dfi-url='https://dfi-api.excession.localdev'
```
