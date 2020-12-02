import { Mert, useMertQuery, useMertsQuery } from "../../generated/graphql";
import Link from "next/link";
import { Typography } from "antd";
import MainPost from "../../components/Mert";
import { useRouter, withRouter } from "next/router";
import UserInfo from "../../components/UserInfo";
import { WithRouterProps } from "next/dist/client/with-router";
import { withApollo } from "../../lib/withApollo";
const { Link: LinkAntd, Title } = Typography;

const UserPage = ({ router }: WithRouterProps) => {
  const { data: res, loading } = useMertsQuery({
    variables: {
      cursor:
        (typeof router.query.user === "string" && router.query.user) || null,
      mertId: null,
    },
  });

  // TODO: show a good old vector for no merts published

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "start",
        position: "relative",
        justifyContent: "center",
        marginTop: "-1rem",
        borderLeft: "0.5px solid #74BBFF",
        borderRight: "0.5px solid #74BBFF",
      }}
    >
      <div style={{ position: "absolute", left: "-20rem" }}>
        <UserInfo />
      </div>
      <div style={{ width: "100%" }}>
        {res?.merts?.merts?.length === 0 && !loading ? (
          <div style={{ width: "100%", height: "24rem", textAlign: "center" }}>
            <img
              style={{ width: "100%", height: "100%", marginBottom: "1rem" }}
              src="/assets/no_merts.svg"
              alt=""
            />
            <Title level={3}>
              <Link passHref href="/">
                <LinkAntd>Add some merts</LinkAntd>
              </Link>
            </Title>
          </div>
        ) : (
          res?.merts?.merts?.map((m) => {
            return <MainPost mert={m as Mert} key={m.id} />;
          })
        )}
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(withRouter(UserPage));
