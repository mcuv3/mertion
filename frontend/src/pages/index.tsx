import { NextPageContext } from "next";
import { withApollo } from "../lib/withApollo";

import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react";

import {
  MeResponse,
  Mert,
  useMeLazyQuery,
  useMeQuery,
  useMertsQuery,
} from "../generated/graphql";
import MainPost from "../components/MainPost";
import { AddPost } from "../components/AddPost";
import { useIsAuth } from "../lib/useIsAuth";

const Home = () => {
  useIsAuth();
  const { data, loading } = useMeQuery();
  const { data: merts } = useMertsQuery({
    variables: { cursor: null, mertId: null },
  });
  return (
    <div style={{ width: "100%" }}>
      {data?.me && !loading && <AddPost me={data?.me as MeResponse} />}
      {merts?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(observer(Home));
