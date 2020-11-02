import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";
import {} from "../generated/graphql";
import { createUploadLink } from "apollo-upload-client";

const link = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export let client: ApolloClient<NormalizedCacheObject>;

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link,
    uri: process.env.NEXT_PUBLIC_API_URL as string,
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
            merts: {
              merge(current = [], newer) {
                return [...newer, ...current];
              },
            },
            // your mutations
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
