import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Maybe } from "../../generated/graphql";
import { __prod__ } from "../../util/constants";
import { SafeClick } from "../ui/SafeClick";

interface Props {
  picture?: Maybe<string> | (undefined & string);
  username?: string;
  clickable?: boolean;
}

export const UserAvatar = ({ picture, username, clickable = true }: Props) => {
  const router = useRouter();

  return (
    <SafeClick
      onClick={
        clickable ? () => router.push("/[user]", `/${username}`) : () => {}
      }
    >
      <Image
        layout="fixed"
        width={50}
        height={50}
        src={(__prod__ ? picture : picture?.replace("localhost", "app")) || ""}
        alt={username || ""}
      />
    </SafeClick>
  );
};
