import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Créez un client Apollo
const client = new ApolloClient({
  uri: 'http://localhost:8082/graphql',  // Assurez-vous que l'URL correspond à votre serveur GraphQL
  cache: new InMemoryCache(),
});

export { client, ApolloProvider };
