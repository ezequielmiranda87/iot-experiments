
const ws = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { buildSchema } = require('graphql');

const { typeDefs } = require('./src/schema/index.js')
const { resolvers } = require('./src/resolvers/index.js')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(typeDefs);

const PORT = 8080

try {
    // Start websocket server
    const server = new ws.Server({
        port: PORT,
        path: '/graphql',
    });

    server.on('connection', function incoming() {
        console.log('Connection....');
    });

    server.on('message', function incoming(message) {
        console.log(`message`, message);
    });

    // Add GraphQL layer to websocket server
    useServer(
        { schema, roots: resolvers },
        server,
    );

    console.log(`[GRAPHQL_SERVER ] - Listening to port ${PORT}`);

} catch (error) {
    console.log(error)
}


