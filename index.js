const { InMemoryCache } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-client").default;
const { WebSocketLink } = require("apollo-link-ws");
const gql = require("graphql-tag");
const WebSocket = require("ws");
const ApolloLink = require("apollo-link");
const { createHttpLink } = require("apollo-link-http");
const { getMainDefinition } = require("apollo-utilities");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * 
 * @param {{ httpEndpoint: string, wsEndpoint: string, bearerToken: string }} params 
 * @returns { ApolloClient }
 */

const configureClient = ({ httpEndpoint, wsEndpoint, bearerToken }) => {
  const wsLink = new WebSocketLink({
    uri: wsEndpoint,
    options: {
      reconnect: true,
      connectionParams: async () => {
        return {
          Authorization: bearerToken
        };
      }
    },
    webSocketImpl: WebSocket
  });

  const httpLink = createHttpLink({
    uri: httpEndpoint,
    // fetch: fetch,
    headers: {
      Authorization: bearerToken
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

  return apolloClient
}



/**
 * Example
 * const GRAPHQL_ENDPOINT = "https://api.ecomon.no";
 * const GRAPHQL_ENDPOINT_WS = "wss://api.ecomon.no";
 * const TOKEN = "Bearer intermediary-api-key_858bef2f-5b67-49b2-b7e0-c07a093f98be";
 * 
 * const client = configureClient({
 *  httpEndpoint: GRAPHQL_ENDPOINT,
 *  wsEndpoint: GRAPHQL_ENDPOINT_WS,
 *  bearerToken: TOKEN
 * })
 * 
 * // Test subscription
 * client
 * .subscribe({
 *   query: gql`
 *     subscription {
 *       realtimeMeasurement(deviceId: "pM8SEyRQ") {
 *         activePowerImport
 *         time
 *       }
 *     }
 *   `,
 *   variables: {}
 * })
 * .subscribe({
 *   next(data) {
 *     console.log(data);
 *   }
 * });
 * 
 */






module.exports = { configureClient, gql }