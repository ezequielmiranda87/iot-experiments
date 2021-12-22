# iot-save-telemetry-data

The lambda function will receive data from our IoT device, routed by the AWS IoT rule, and the function will create a new item in the DynamoDB collection:

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

After running deploy, you should see output similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service iot-save-telemetry-data.zip file to S3 (12.3 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.........
Serverless: Stack update finished...
Service Information
service: iot-save-telemetry-data
stage: dev
region: us-east-1
stack: iot-save-telemetry-data-dev
resources: 8
api keys:
  None
endpoints:
functions:
  hello: iot-save-telemetry-data-dev-hello
layers:
  None
Serverless: Publishing service to the Serverless Dashboard...
Serverless: Successfully published your service to the Serverless Dashboard: https://app.serverless.com/ezequielmiranda87/apps/iot-core-services/iot-save-telemetry-data/dev/us-east-1
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Item created in DB\" \n}"
}

            "message": "Item created in DB",

```

### Local development

You can invoke your function locally by using the following command:


```bash
 serverless invoke local --function hello --path mocks/event-mock.json

```


or

```bash
 serverless invoke local --function hello --data '{
   ezequielmiranda@Ezequiels-MacBook-Pro
  "serialNumber": "SN-D7F3C8947867",
  "dateTime": "2021-9-17 12:46:49",
  "activated": "true",
  "device": "MyRaspperry-01",
  "type": "MySmartIoTDevice",
  "payload": {
    "pressure": 80,
    "temperature": 39
  }
}
```

Which should result in response similar to the following:

```
Received event: {
  "serialNumber": "SN-D7F3C8947867",
  "dateTime": "2021-9-17 12:46:49",
  "activated": "true",
  "device": "MyRaspperry-01",
  "type": "MySmartIoTDevice",
  "payload": {
    "pressure": 80,
    "temperature": 39
  }
}
Saving Telemetry Data
Data saved: {
  "TableName": "IoTCatalog",
  "Item": {
    "serialNumber": "SN-D7F3C8947867",
    "timestamp": "2021-9-17 12:46:49",
    "activated": "true",
    "device": "MyRaspperry-01",
    "type": "MySmartIoTDevice",
    "payload": {
      "pressure": 80,
      "temperature": 39
    }
  }
}
```
