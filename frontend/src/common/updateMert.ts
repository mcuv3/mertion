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
      try {
        const merts = cache.readQuery<MertsQuery>({
          query: MertsDocument,
          variables: { cursor: null, mertId: fatherId || null },
        });

        const mert = data.createMert.mert;

        cache.writeQuery<MertsQuery>({
          query: MertsDocument,
          variables: { cursor: null, mertId: fatherId || null },
          data: {
            merts: {
              hasMore: Boolean(merts?.merts?.hasMore),
              merts: [{ ...mert, fromCache: true } as any],
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  return foo;
};
