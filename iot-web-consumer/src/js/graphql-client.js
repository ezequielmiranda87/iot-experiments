
const graphqlServerGlitch = 'wss://ezex-iot-graphql-server.glitch.me/graphql'
const graphqlServer = "ws://localhost:8080/graphql"

export const client = graphqlWs.createClient({
    url: graphqlServer,
});
