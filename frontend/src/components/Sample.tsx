import { NextPageContext } from "next";
import { withApollo } from "../lib/withApollo";

import React, { useContext } from "react";
import { observer } from "mobx-react";
import PostsStore from "../store/index";

export const Sample = observer(() => {
  const store = useContext(PostsStore);

  return (
    <div>
      store1:{store.num}
      Store2: {store.cashRegister.priceWithIva}
    </div>
  );
});
