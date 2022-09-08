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
import configureClient from 'graphql-apollo-client';

const client = configureClient({
  httpEndpoint, 
  wsEndpoint, 
  bearerToken
})
`
```

The above code is to configure client. Now it's time to use this client
Note: To define query you need to install graphql-tag to use `gql`

```js
import { gql } from 'graphql-tag';

client
  .query({
    query: gql`
      query Books {
        books {
          title
          author
        }
      }
    `,
    variables: {},
  })
  .then(console.log)

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
   variables: {}
 })
 .subscribe({
   next(data) {
     console.log(data);
   }
 });
 ```
