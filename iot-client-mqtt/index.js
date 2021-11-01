const { connect } = require('mqtt')

const MQTTbroker = 'mqtt://broker.hivemq.com'
const topic = 'ezex-test/sensor1'

const client = connect(MQTTbroker)

const getDummySensorData = () => ({
    subscribe2sensor: {
        temp: 20. + Math.random() * 1,
        humid: 30. + Math.random() * 1,
        time: new Date()
    }
})

client.on('connect', function () {
    console.log(`Connecting to MQTT broker`)
    client.subscribe(topic, function (err) {
        if (!err) {
            setInterval(() => client.publish(topic, JSON.stringify(getDummySensorData())), 3000)
            return true
        }
        console.log(err)
    })
})


// Handlers

client.on('message', function (topic, message) {
    console.log(`Message incoming topic:`, topic)
    console.log(message.toString())
})

client
    .on('error', function (topic, payload) {
        console.log('Error:', topic, payload.toString());
    });
