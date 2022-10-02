const { configureClient, gql } = require('./index');

const GRAPHQL_ENDPOINT = 'https://api.ecomon.no';
const GRAPHQL_ENDPOINT_WS = 'wss://api.ecomon.no';
const TOKEN = 'Bearer intermediary-api-key_858bef2f-5b67-49b2-b7e0-c07a093f98be';

const client = configureClient({
  httpEndpoint: GRAPHQL_ENDPOINT,
  wsEndpoint: GRAPHQL_ENDPOINT_WS,
  bearerToken: TOKEN,
});

// Test subscription
client
  .subscribe({
    query: gql`
      subscription {
        realtimeMeasurement(deviceId: "pM8SEyRQ") {
          activePowerImport
          time
        }
      }
    `,
    variables: {},
  })
  .subscribe({
    next(data) {
      console.log(data);
    },
    error(err) {
      console.log(err);
    },
  });
