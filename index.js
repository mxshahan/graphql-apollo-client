const { InMemoryCache } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-client").default;
const { WebSocketLink } = require("apollo-link-ws");
const gql = require("graphql-tag");
const WebSocket = require("ws");
const ApolloLink = require("apollo-link");
const { createHttpLink } = require("apollo-link-http");
const { getMainDefinition } = require("apollo-utilities");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const GRAPHQL_ENDPOINT = "https://api.ecomon.no";
const GRAPHQL_ENDPOINT_WS = "wss://api.ecomon.no";
const TOKEN = "intermediary-api-key_858bef2f-5b67-49b2-b7e0-c07a093f98be";

const wsLink = new WebSocketLink({
  uri: GRAPHQL_ENDPOINT_WS,
  options: {
    reconnect: true,
    connectionParams: async () => {
      return {
        Authorization: `Bearer ${TOKEN}`
      };
    }
  },
  webSocketImpl: WebSocket
});

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetch: fetch,
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
});

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});

// Test subscription
apolloClient
  .subscribe({
    query: gql`
      subscription {
        realtimeMeasurement(deviceId: "pM8SEyRQ") {
          activePowerImport
          time
        }
      }
    `,
    variables: {}
  })
  .subscribe({
    next(data) {
      console.log(data);
    }
  });
