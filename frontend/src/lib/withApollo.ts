import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";
import { createUploadLink } from "apollo-upload-client";

const link = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export let client: ApolloClient<NormalizedCacheObject>;

const createClient = (ctx: NextPageContext) => {
  console.log(ctx?.req);
  client = new ApolloClient({
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
            // your mutations
          },
        },
      },
    }),
  });
  return client;
};

export const withApollo = createWithApollo(createClient);
