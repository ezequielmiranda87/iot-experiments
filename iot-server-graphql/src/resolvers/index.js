const { MQTTPubSub } = require('graphql-mqtt-subscriptions');
const { connect } = require('mqtt');

const topic = 'ezex-test/sensor1'


const client = connect('mqtt://broker.hivemq.com');

client.on('message', (msg) => {
    console.log(`Message received`)
    console.log; (msg)
})

const pubsub = new MQTTPubSub({
    client
});

const resolvers = {
    query: {
        sensors: () => 'Hello World!',
    },
    subscription: {
        subscribe2sensor: (_, args) => {
            return pubsub.asyncIterator(topic)
        }
    },
}

module.exports = { resolvers };