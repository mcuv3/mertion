import { UpCircleOutlined } from "@ant-design/icons";
import { BackTop } from "antd";
import React from "react";
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
  const { data: res, fetchMore, loading: loadingMerts } = useMertsQuery({
    variables: { cursor: null, mertId: null },
    notifyOnNetworkStatusChange: true,
  });
  const { data, loading } = useMeQuery();

  useNewMertSubscription({
    onSubscriptionData: ({ client, subscriptionData }) => {
      const mert = subscriptionData.data?.newMert;
      const currentUserId = data?.me?.id;

      if (mert && mert.user.id !== currentUserId)
        client.cache.writeQuery<MertsQuery>({
          query: MertsDocument,
          variables: { cursor: null, mertId: null },
          data: {
            merts: {
              hasMore: Boolean(res?.merts?.hasMore),
              merts: [mert],
            },
          },
        });
    },
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

  return (
    <div className="fullWidth">
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
