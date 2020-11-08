import { Mert, useMertQuery, useMertsQuery } from "../../generated/graphql";
import MainPost from "../../components/Mert";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  const { data: merts } = useMertsQuery({
    variables: {
      cursor:
        (typeof router.query.user === "string" && router.query.user) || null,
      mertId: null,
    },
  });

  console.log("RENDERED");
  return (
    <div style={{ width: "100%" }}>
      {merts?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default UserPage;
