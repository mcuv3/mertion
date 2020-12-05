import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { MertsResponse } from "../generated/graphql";

const URI =
  typeof window === "undefined"
    ? process.env.SERVER_URL
    : process.env.NEXT_PUBLIC_API_URL;

const buildLink = (ctx: NextPageContext) => {
  const uploadLInk = createUploadLink({
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    uri: URI,
    credentials: "include",
  });

  if (typeof window === "undefined") return uploadLInk;

  const client = new SubscriptionClient("ws://localhost:4000/subscriptions", {
    reconnect: true,
    connectionParams: {
      headers: {
        cookie:
          (typeof window === "undefined"
            ? ctx?.req?.headers.cookie
            : undefined) || "",
      },
    },
  });

  const wsLink = new WebSocketLink(client);

  const link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === "OperationDefinition" && def.operation === "subscription"
      );
    },
    wsLink,
    uploadLInk
  );

  return link;
};

const createClient = (ctx: NextPageContext) => {
  return new ApolloClient({
    link: buildLink(ctx),
    uri: URI,
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
              keyArgs: ["mertId", "cursor"],
              merge(
                newer: MertsResponse = { merts: [], hasMore: true },
                older: MertsResponse
              ): MertsResponse {
                if (older.merts.length === 1) {
                  return {
                    hasMore: older.hasMore,
                    merts: [...older.merts, ...newer.merts],
                  };
                }
                if (older.merts.length > 0) {
                  const isValidMerge = newer.merts.find(
                    (e: any) => e?.__ref === (older.merts[0] as any)?.__ref
                  );
                  if (isValidMerge) return newer;
                }
                console.log("OLDER", older);
                console.log("NEWER", newer);
                return {
                  hasMore: older.hasMore,
                  merts: [...newer.merts, ...older.merts],
                };
              },
            },
          },
        },
      },
    }),
  });
};

export const withApollo = createWithApollo(createClient);
