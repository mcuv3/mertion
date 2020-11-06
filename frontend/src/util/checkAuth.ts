import { NextRouter } from "next/router";
import { MeQuery, MeResponse } from "../generated/graphql";

export const isAuth = (router: NextRouter, me?: MeQuery, nextUrl?: string) =>
  me?.me?.email
    ? true
    : (() => {
        router.push(`/login${nextUrl ? `?next=${nextUrl}` : ""}`);
        return false;
      })();
