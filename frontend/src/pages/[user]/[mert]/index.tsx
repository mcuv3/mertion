import { withApollo } from "../../../lib/withApollo";
import {
  Mert,
  useMertQuery,
  useMertsByIdLazyQuery,
  useMertsByIdQuery,
  useMertsLazyQuery,
  useMertsQuery,
} from "../../../generated/graphql";
import { NextRouter, useRouter } from "next/router";
import MertPost from "../../../components/Mert";
import React, { useEffect, useState } from "react";
import NotFound from "../../../components/404";
import { Spin } from "antd";

const getMertId = (router: NextRouter) =>
  typeof router.query?.mert === "string" ? router.query!.mert : null;

const UserMert = () => {
  const router = useRouter();
  const [_, setFathers] = useState<Set<string>>(
    new Set([getMertId(router) as string])
  );

  const [
    fetchFathers,
    { data: fatherMerts, loading: loadingFathers },
  ] = useMertsByIdLazyQuery({
    variables: {
      mertIds: [getMertId(router) as string],
    },
  });

  const [fetchChildren, { data: nestedMerts }] = useMertsLazyQuery();

  useEffect(() => {
    fetchFathers({
      variables: {
        mertIds: [getMertId(router) as string],
      },
    });
    fetchChildren({
      variables: {
        cursor: null,
        mertId: getMertId(router),
      },
    });
  }, []);

  const addFatherHandler = (mert: Mert, isFather = false) => {
    setFathers((fathers) => {
      let arr = Array.from(fathers);
      if (isFather) {
        const index = arr.findIndex((e) => e === mert.id);
        arr = arr.slice(0, index + 1);
      } else arr.push(mert.id);

      fetchFathers({
        variables: {
          mertIds: arr,
        },
      });

      return new Set(arr);
    });

    fetchChildren({
      variables: {
        cursor: null,
        mertId: mert.id,
      },
    });
  };

  if (!loadingFathers && fatherMerts?.mertsById.length === 0)
    return <Spin style={{ textAlign: "center", margin: "auto" }} />;

  return (
    <div className="fullWidth">
      {fatherMerts?.mertsById.map((father, index) => {
        return (
          <MertPost
            key={father.id}
            mert={father as Mert}
            isFather
            fromUserMert
            addFather={(mert) => addFatherHandler(mert, true)}
          />
        );
      })}
      {nestedMerts?.merts?.merts.map((m) => {
        return (
          <MertPost
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
