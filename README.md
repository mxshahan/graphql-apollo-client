# graphql-apollo-client

Helpful utility that will make your development process faster. This can be used in any library. Basically nodejs based.

### Install Package
```bash 
npm install graphql-apollo-client --save 
```
or
```bash
yarn add graphql-apollo-client
```


### Example


```js
import { configureClient } from 'graphql-apollo-client';

const client = configureClient({
  httpEndpoint: '<HTTP_GRAPHQL_URL>', 
  wsEndpoint: '<WS_GRAPHQL_URL>', 
  bearerToken: 'Bearer <TOKEN>'
})
`
```

The above code is to configure client. Now it's time to use this client
Note: To define query you need import `gql` from `graphql-apollo-client`

```js
import { gql } from 'graphql-apollo-client';


const query = gql`
  query Books {
    books {
      title
      author
    }
  }
`

const subscription = gql`
  subscription {
    realtimeMeasurement(deviceId: "pM8SEyRQ") {
      activePowerImport
      time
    }
  }
`

client
  .query({
    query: query,
    variables: {},
  })
  .then(console.log)

client
 .subscribe({
   query: subscription,
   variables: {}
 })
 .subscribe({
   next(data) {
     console.log(data);
   }
 });
 ```
