import { Maybe } from "graphql/jsutils/Maybe";
import Image from "next/image";
import React from "react";

interface Props {
  picture?: Maybe<string>;
  mertId: string;
  mert: string;
}

export const MertContent = ({ mertId, picture, mert }: Props) => {
  return (
    <>
      <p style={{ marginBottom: "1rem" }}>{mert}</p>
      {picture && (
        <div className="mertImage">
          <Image
            alt={mertId}
            src={picture?.replace("localhost", "app") || ""}
            quality={100}
            width={650}
            height={410}
            layout="fixed"
            objectFit="cover"
          />
        </div>
      )}
    </>
  );
};
