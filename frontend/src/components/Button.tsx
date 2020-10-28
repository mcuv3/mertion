import { NextPageContext } from "next";
import { withApollo } from "../lib/withApollo";

import React, { useContext } from "react";
import { observer } from "mobx-react";
import PostsStore from "../store/index";

export const CustomButton = () => {
  const store = useContext(PostsStore);

  return (
    <div>
      <button onClick={() => store.reset()}>Reset</button>
      <button
        onClick={() => {
          store.add(2);
          store.cashRegister.add();
        }}
      >
        Add
      </button>
    </div>
  );
};
