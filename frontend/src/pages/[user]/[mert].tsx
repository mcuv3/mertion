import { withApollo } from "../../lib/withApollo";
import { Mert, useMertQuery, useMertsQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import MainPost from "../../components/MainPost";
import React from "react";
import { NotFound } from "../../components/404";

const Post = () => {
  const router = useRouter();

  const { data: father } = useMertQuery({
    variables: {
      mertId:
        typeof router.query?.mert === "string" ? router.query!.mert : null,
    },
  });
  const { data } = useMertsQuery({
    variables: {
      cursor: null,
      mertId:
        typeof router.query?.mert === "string" ? router.query?.mert : null,
    },
  });

  if (!father?.mert) return <NotFound />;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "1rem" }}>
        <MainPost mert={father.mert as Mert} father />
      </div>

      {data?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Post);
