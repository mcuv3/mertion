import { NextPageContext } from "next";
import { withApollo } from "../lib/withApollo";

import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react";
import PostsStore from "../store/index";
import { MeResponse, useMeLazyQuery, useMeQuery } from "../generated/graphql";
import MainPost from "../components/MainPost";
import { AddPost } from "../components/AddPost";
import { useIsAuth } from "../lib/useIsAuth";

const Home = () => {
  useIsAuth();
  const store = useContext(PostsStore);
  const { data, loading } = useMeQuery();
  return (
    <div>
      {data?.me && !loading && <AddPost {...(data?.me as MeResponse)} />}
      <MainPost />
    </div>
  );
};

export default withApollo({ ssr: true })(observer(Home));

{
  /* {store.num}
Store2: {store.cashRegister.priceWithIva}
<p>
  <button onClick={() => store.reset()}>Reset</button>
  <button
    onClick={() => {
      store.add(1);
      store.cashRegister.add();
    }}
  >
    Add
  </button>
</p> */
}
