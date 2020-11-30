import { withApollo } from "../lib/withApollo";
import React, { useEffect, useState } from "react";
import {
  MeResponse,
  Mert,
  MertsDocument,
  MertsQuery,
  useMeQuery,
  useMertsQuery,
  useNewMertSubscription,
} from "../generated/graphql";
import MainPost from "../components/Mert";
import { AddPost } from "../components/AddPost";
import { useIsAuth } from "../lib/useIsAuth";
import { UpCircleOutlined } from "@ant-design/icons";
import { InMemoryCache, useApolloClient } from "@apollo/client";
import { BackTop } from "antd";
const style: React.CSSProperties = {
  height: 40,
  width: 40,
  lineHeight: "40px",
  borderRadius: 4,
  backgroundColor: "#1088e9",
  color: "#fff",
  textAlign: "center",
  fontSize: 14,
};

const Home = () => {
  useIsAuth();
  const { data: newMert, loading: loadNewMerts } = useNewMertSubscription();
  const client = useApolloClient();
  const { data, loading } = useMeQuery();
  const { data: merts, fetchMore, loading: loadingMerts } = useMertsQuery({
    variables: { cursor: null, mertId: null },
    notifyOnNetworkStatusChange: true,
  });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (merts?.merts) {
      const listener = window.addEventListener("scroll", () => {
        const downPosition =
          window.scrollY + document.documentElement.clientHeight;
        if (downPosition + 350 >= document.documentElement.scrollHeight) {
          // TODO: fetch more
          // document.body.style.height = `${document.body.clientHeight + 50}px`;
          if (merts?.merts && !loadingMerts && merts.merts.length > 9) {
            console.log(merts.merts[merts.merts.length - 1]?.mert);
            fetchMore({
              variables: {
                cursor: new Date(
                  +merts.merts[merts.merts.length - 1]?.createdAt
                ).toString(),
                mertId: null,
              },
            });
          }
        }
      });
    }
  }, [merts]);

  useEffect(() => {
    if (
      newMert &&
      !loadNewMerts &&
      newMert?.newMert?.user?.username !== data?.me?.username
    ) {
      client.cache.writeQuery<MertsQuery>({
        query: MertsDocument,
        variables: { cursor: null, mertId: null },
        data: {
          merts: [newMert.newMert, ...(merts?.merts || [])],
        },
      });
    }
  }, [newMert]);
  return (
    <div style={{ width: "100%" }}>
      <BackTop style={style}>
        <UpCircleOutlined />
      </BackTop>
      {data?.me && !loading && <AddPost me={data?.me as MeResponse} />}
      {merts?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
