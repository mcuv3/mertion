import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";

import { createUploadLink } from "apollo-upload-client";

console.log(
  typeof window === "undefined"
    ? process.env.SERVER_URL
    : process.env.NEXT_PUBLIC_API_URL
);

const link = createUploadLink({
  uri:
    typeof window === "undefined"
      ? process.env.SERVER_URL
      : process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link,
    uri:
      typeof window === "undefined"
        ? process.env.SERVER_URL
        : process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // merts: {
            //   merge(current = [], newer) {
            //     return [...newer, ...current];
            //   },
            // },
            // your mutations
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
