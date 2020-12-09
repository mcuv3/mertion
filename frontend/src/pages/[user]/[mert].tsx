import { withApollo } from "../../lib/withApollo";
import {
  Mert,
  useMertQuery,
  useMertsLazyQuery,
  useMertsQuery,
} from "../../generated/graphql";
import { NextRouter, useRouter } from "next/router";
import MainPost from "../../components/Mert";
import React, { useEffect, useState } from "react";
import { NotFound } from "../../components/404";
import { Spin } from "antd";

const getMertId = (router: NextRouter) =>
  typeof router.query?.mert === "string" ? router.query!.mert : null;

const UserMert = () => {
  const router = useRouter();
  const [fathers, setFathers] = useState<Set<string | undefined>>(new Set());
  const { data: father } = useMertQuery({
    variables: {
      mertId: getMertId(router),
    },
  });

  const { data: fathersMerts } = useMertsQuery({
    variables: {
      mertId: getMertId(router),
      cursor: null,
    },
  });

  const [fetch, { data: nestedMerts }] = useMertsLazyQuery();

  useEffect(() => {
    if (father?.mert) setFathers((f) => f.add(father?.mert?.id));
    fetch({
      variables: {
        cursor: null,
        mertId: getMertId(router),
      },
    });
  }, [father]);

  const addFatherHandler = (mert: Mert) => {
    setFathers((fathers) => {
      const isInFathers = fathers.has(mert.id);
      if (isInFathers) {
        const arr = Array.from(fathers);
        const index = arr.findIndex((e) => e === mert.id);
        arr.slice(0, index + 1);
        return new Set(arr);
      }

      const newFathers = fathers.add(mert.id);
      return newFathers;
    });
    fetch({
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
        <MainPost
          key={father.mert.id}
          mert={father.mert as Mert}
          isFather
          fromUserMert
          addFather={addFatherHandler}
        />
        {fathersMerts?.merts?.merts.map((father) => {
          if (fathers.has(father.id))
            return (
              <MainPost
                key={father.id}
                mert={father as Mert}
                isFather
                fromUserMert
                addFather={addFatherHandler}
              />
            );

          return null;
        })}
      </div>
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
