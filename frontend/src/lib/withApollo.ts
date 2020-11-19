import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";

import { createUploadLink } from "apollo-upload-client";

const URI =
  typeof window === "undefined"
    ? process.env.SERVER_URL
    : process.env.NEXT_PUBLIC_API_URL;

console.log(URI);

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: createUploadLink({
      headers: {
        cookie:
          (typeof window === "undefined"
            ? ctx?.req?.headers.cookie
            : undefined) || "",
      },
      uri: URI,
      credentials: "include",
    }),
    uri: URI,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      // typePolicies: {
      //   // Query: {
      //   //   fields: {},
      //   // },
      // },
    }),
  });

export const withApollo = createWithApollo(createClient);
