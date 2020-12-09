import { UpCircleOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { BackTop } from "antd";
import React, { useEffect } from "react";
import { CreateMert } from "../components/CreateMert";
import MainPost from "../components/Mert";
import {
  MeResponse,
  Mert,
  MertsDocument,
  MertsQuery,
  useMeQuery,
  useMertsQuery,
  useNewMertSubscription,
} from "../generated/graphql";
import { useScroll } from "../hooks/useScroll";
import { useIsAuth } from "../lib/useIsAuth";
import { withApollo } from "../lib/withApollo";
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
  const { data: res, fetchMore, loading: loadingMerts } = useMertsQuery({
    variables: { cursor: null, mertId: null },
    notifyOnNetworkStatusChange: true,
  });

  useScroll({
    cb: fetchMoreMertsHandler,
    allowCondition: !loadingMerts && Boolean(res?.merts?.hasMore),
    depends: [res?.merts],
  });

  function fetchMoreMertsHandler() {
    if (res?.merts?.merts && res?.merts?.merts?.length > 9 && fetchMore) {
      const lastMertIndex = res.merts.merts.length - 1;
      fetchMore({
        variables: {
          cursor: res.merts.merts[lastMertIndex]?.createdAt.toString(),
          mertId: null,
        },
      });
    }
  }

  useEffect(() => {
    if (
      newMert &&
      !loadNewMerts &&
      newMert?.newMert?.user?.username !== data?.me?.username &&
      res?.merts?.merts
    ) {
      client.cache.writeQuery<MertsQuery>({
        query: MertsDocument,
        variables: { cursor: null, mertId: null },
        data: {
          merts: {
            hasMore: res.merts.hasMore,
            merts: [newMert.newMert as Mert, ...(res?.merts?.merts || [])],
          },
        },
      });
    }
  }, [newMert]);

  return (
    <div style={{ width: "100%" }}>
      <BackTop style={style}>
        <UpCircleOutlined />
      </BackTop>
      {data?.me && !loading && <CreateMert me={data?.me as MeResponse} />}
      {res?.merts?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
