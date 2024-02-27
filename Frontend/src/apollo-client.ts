// import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// const token = localStorage.getItem("jwtToken") || "";

// //const token = localStorage.getItem("jwtToken");

// const client = new ApolloClient({
//   const token = localStorage.getItem("jwtToken") || "";
//   link: new HttpLink({
//     uri: "http://localhost:3000/graphql",
//     headers: {
//       Authorization: token ? token : "",
//     }, // Update with your server URL
//   }), // Replace with your GraphQL server URI
//   cache: new InMemoryCache(),
// });
// export default client;

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink: any = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink: any = setContext((_, { headers }: any) => {
  // get the authentication token from local storage if it exists
  const token: string | null = localStorage.getItem("jwtToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
