import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { MertsResponse } from "../generated/graphql";

const __server__ = typeof window === "undefined";

let URI = __server__ ? process.env.SERVER_URL : process.env.NEXT_PUBLIC_API_URL;
let URI_SW = __server__
  ? process.env.SERVER_URL_WS
  : process.env.NEXT_PUBLIC_API_WS;

if (process.env.NODE_ENV !== "development") {
  URI = process.env.NEXT_PUBLIC_API_URL_PRODUCTION;
  URI_SW = process.env.NEXT_PUBLIC_API_WS_PRODUCTION || "";
}

const buildLink = (ctx: NextPageContext, headers: Record<string, string>) => {
  const uploadLInk = createUploadLink({
    headers,
    uri: URI,
    credentials: "include",
  });

  if (__server__) return uploadLInk;

  const client = new SubscriptionClient(URI_SW as string, {
    reconnect: true,
    reconnectionAttempts: 50,
    connectionParams: {
      headers,
    },
    minTimeout: 60000,
    connectionCallback: (err) => {
      console.log(err);
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
  const headers = {
    cookie: (__server__ ? ctx?.req?.headers.cookie : undefined) || "",
  };

  return new ApolloClient({
    link: buildLink(ctx, headers),
    uri: URI,
    credentials: "include",
    headers,
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
                // console.log("OLDER", older);
                // console.log("NEWER", newer);
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
