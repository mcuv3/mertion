//import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = (): { loading: boolean } => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!data?.me && !loading && router.pathname !== "/") {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data]);

  return { loading };
};
