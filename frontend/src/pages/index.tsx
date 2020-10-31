import { NextPageContext } from "next";
import { withApollo } from "../lib/withApollo";

import React, { useContext } from "react";
import { observer } from "mobx-react";
import PostsStore from "../store/index";
import { useMeQuery } from "../generated/graphql";

const Home = () => {
  const store = useContext(PostsStore);
  const { data } = useMeQuery();

  return (
    <div>
      {store.num}
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
      </p>
    </div>
  );
};

export default withApollo({ ssr: true })(observer(Home));
