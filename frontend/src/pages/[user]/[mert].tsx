import { withApollo } from "../../lib/withApollo";
import {
  Mert,
  useMertQuery,
  useMertsLazyQuery,
  useMertsQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import MainPost from "../../components/Mert";
import React, { useEffect, useState } from "react";
import { NotFound } from "../../components/404";
import { Spin } from "antd";

const UserMert = () => {
  const router = useRouter();
  const [fathers, setFathers] = useState<Mert[]>([]);
  const { data: father } = useMertQuery({
    variables: {
      mertId:
        typeof router.query?.mert === "string" ? router.query!.mert : null,
    },
  });

  const [fetch, { data: nestedMerts }] = useMertsLazyQuery();

  useEffect(() => {
    if (father?.mert) setFathers([father?.mert as Mert]);
    fetch({
      variables: {
        cursor: null,
        mertId:
          typeof router.query?.mert === "string" ? router.query!.mert : null,
      },
    });
  }, [father]);

  const addFatherHandler = async (mert: Mert) => {
    setFathers((fathers) => {
      const indexFather = fathers.findIndex((f) => f.id === mert.id);
      if (indexFather === -1) return [...fathers, mert];
      return fathers.slice(0, indexFather + 1);
    });
    await fetch({
      variables: {
        cursor: null,
        mertId: mert.id,
      },
    });
  };

  if (!father?.mert)
    return <Spin style={{ textAlign: "center", margin: "auto" }} />;

  return (
    <div style={{ width: "100%" }}>
      <div>
        {fathers.map((father) => {
          return (
            <MainPost
              key={father.id}
              mert={father}
              isFather
              fromUserMert
              addFather={addFatherHandler}
            />
          );
        })}
      </div>
      {/* //TODO: update accord the comments */}
      {nestedMerts?.merts?.merts.map((m) => {
        return (
          <MainPost
            fromUserMert
            mert={m as Mert}
            key={m.id}
            addFather={addFatherHandler}
          />
        );
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(UserMert);
