import { withApollo } from "../../lib/withApollo";
import { Mert, useMertsQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import { useStore } from "../../store";
import MainPost from "../../components/MainPost";
const Post = () => {
  const router = useRouter();

  const { mertStore } = useStore();
  const { data } = useMertsQuery({
    variables: {
      cursor: null,
      mertId:
        typeof router.query?.mert === "string" ? router.query?.mert : null,
    },
  });
  // if(data?.merts)
  console.log(mertStore.mert);
  if (!mertStore?.mert) return <div>Not Found</div>;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "1rem" }}>
        <MainPost mert={mertStore.mert as Mert} />
      </div>

      {data?.merts?.map((m) => {
        return <MainPost mert={m as Mert} key={m.id} />;
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Post);
