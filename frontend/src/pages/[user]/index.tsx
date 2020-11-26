import { Mert, useMertQuery, useMertsQuery } from "../../generated/graphql";
import MainPost from "../../components/Mert";
import { useRouter } from "next/router";
import UserInfo from "../../components/UserInfo";

const UserPage = () => {
  const router = useRouter();
  const { data: merts, loading } = useMertsQuery({
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
      }}
    >
      <div style={{ position: "absolute", left: "-20rem" }}>
        <UserInfo />
      </div>
      <div style={{ width: "100%" }}>
        {merts?.merts?.length === 1 && !loading ? (
          <img src="/assets/no_merts.svg" alt="" />
        ) : (
          merts?.merts?.map((m) => {
            return <MainPost mert={m as Mert} key={m.id} />;
          })
        )}
      </div>
    </div>
  );
};

export default UserPage;
