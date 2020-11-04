import { MutationUpdaterFn } from "@apollo/client";
import {
  CreateMertMutation,
  Mert,
  MertsDocument,
  MertsQuery,
} from "../generated/graphql";

export const updateCreateMert = (fatherId?: string) => {
  const foo: MutationUpdaterFn<CreateMertMutation> = (cache, { data }) => {
    if (data?.createMert.success) {
      const merts = cache.readQuery<MertsQuery>({
        query: MertsDocument,
        variables: { cursor: null, mertId: fatherId || null },
      });
      const mert = data.createMert.mert;
      console.log("RENDER ADDING");
      cache.writeQuery<MertsQuery>({
        query: MertsDocument,
        variables: { cursor: null, mertId: fatherId || null },
        data: {
          merts: [{ ...mert } as Mert, ...(merts?.merts || [])],
        },
      });
    }
  };
  return foo;
};
