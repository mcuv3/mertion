import { withApollo } from "../lib/withApollo";
import React from "react";
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
  const { data: merts } = useMertsQuery({
    variables: { cursor: null, mertId: null },
  });

  React.useEffect(() => {
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
