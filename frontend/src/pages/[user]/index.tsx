import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import MainPost from "../../components/Mert";
import { NoMerts } from "../../components/NoMerts";
import UserInfo from "../../components/UserInfo";
import { Mert, useMertsQuery } from "../../generated/graphql";
import { withApollo } from "../../lib/withApollo";

const UserPage = ({ router }: WithRouterProps) => {
  const { data: res, loading } = useMertsQuery({
    variables: {
      cursor:
        (typeof router.query.user === "string" && router.query.user) || null,
      mertId: null,
    },
  });
  const emptyMerts = res?.merts?.merts?.length === 0;

  return (
    <div className="userProfileContainer">
      <div className="userInfoCard">
        <UserInfo />
      </div>
      <div className="fullWidth">
        {emptyMerts && !loading ? (
          <NoMerts />
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
