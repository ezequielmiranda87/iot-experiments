const typeDefs = `
  type Query {
    sensors: String
  }

  type SensorData {
    temp: Float!
    humid: Float!
    time: String!
  }

  type Subscription {
    subscribe2sensor: SensorData
  }

  schema {
    query: Query
    subscription: Subscription
  }
`;

module.exports = { typeDefs };
