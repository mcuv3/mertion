//import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useIsAuth = (): { loading: boolean } => {
  // const { data, loading } = useMeQuery();
  const router = useRouter();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });

      if (response) {
        router.replace("/login?next=" + router.pathname);
      }
    })();
  }, [loading, router]);

  return { loading };
};

// RETURNS LOADING WHILE WE DECIDE IF THE USER IS AUTH
