import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { createUploadLink } from "apollo-upload-client";

const link = createUploadLink({ uri: "http://localhost:4001/graphql" });

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
            // your mutations
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
