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
      console.log(def);
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
      // typePolicies: {
      //   // Query: {
      //   //   fields: {},
      //   // },
      // },
    }),
  });
};

export const withApollo = createWithApollo(createClient);
