// pages/_app.tsx
import React from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client"; // Ensure this path is correct for your Apollo client setup
import "../styles/globals.css"; // Ensure this path is correct for your global CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
