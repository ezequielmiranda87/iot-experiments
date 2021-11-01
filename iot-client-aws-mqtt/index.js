const awsIot = require('aws-iot-device-sdk');
const sensor = require("node-dht-sensor");

const MQTTbroker = 'a2q5k4pqd9e0uy-ats.iot.us-east-1.amazonaws.com'
const topic = "house/1/temperature"

const useDummyData = false

const client = awsIot.device({
    clientId: 'RasperryMQTTClient',
    host: MQTTbroker,
    port: 8883,
    keyPath: './AWS_Raspberry_secrets/private.pem.key',
    certPath: './AWS_Raspberry_secrets/certificate.pem.crt',
    caPath: './AWS_Raspberry_secrets/AmazonRootCA1.pem',
});

const nowTime = new Date();
const date = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate();
const time = nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds();
const dateTime = date + ' ' + time;


// Telemetry data
const IoTDevice = {
    serialNumber: "SN-D7F3C8947867",
    dateTime,
    activated: true,
    device: "MyRaspberry-01",
    type: "MySmartIoTDevice",
    payload: {}
}


const getSensorData = (cb) =>
    useDummyData ? getDummySensorData(cb) : sensor.read(11, 2, function (err, temperature, humidity) {
        if (!err) {
            const temperatureData = { temp: `${temperature}°C`, humidity: `${humidity}%` }
            console.log(`ACTION - Sending data to AWS  IoT Core'`, temperatureData)
            return cb(temperatureData)
        }
        console.log(err)
    });

const getDummySensorData = (cb) => {
    const temperatureData = { temp: '100°C', humidity: '52%' }
    return cb(temperatureData)
}

const sendData = (data) => {
    const telemetryData = {
        ...IoTDevice,
        payload: data
    }
    console.log(`ACTION - Sending data to AWS  IoT Core'`, telemetryData)
    return client.publish(topic, JSON.stringify(telemetryData))
}

// Connect to AWS IoT Core and subscribe to an topic
client
    .on('connect', function () {
        console.log('Connecting to AWS  IoT Core');
        client.subscribe(topic, function (err) {
            if (!err) {
                setInterval(() => getSensorData(sendData), 3000)
            }
            console.log(err)
        })
    });


// Handlers

client
    .on('message', function (topic, message) {
        console.log('Message incoming topic:', topic, message.toString());
    });

client
    .on('error', function (topic, payload) {
        console.log('Error:', topic, payload.toString());
    });
