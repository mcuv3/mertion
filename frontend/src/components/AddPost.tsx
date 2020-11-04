import { Comment, Avatar, Tooltip } from "antd";
import {
  BaseMertFragment,
  MeResponse,
  Mert,
  MertsDocument,
  MertsQuery,
  useCreateMertMutation,
} from "../generated/graphql";
const {} = Comment;
import React from "react";
import { Editor } from "./Editor";
import { useRouter } from "next/router";
import { changeConfirmLocale } from "antd/lib/modal/locale";
import { updateCreateMert } from "../common/updateMert";

interface Props {
  me: MeResponse;
  fatherId?: string;
}

export const AddPost: React.FC<Props> = ({
  me: { username, picture },
  fatherId,
}) => {
  const router = useRouter();
  const [createMert, { loading }] = useCreateMertMutation({
    update: updateCreateMert(fatherId),
  });

  const create = (mert: string) =>
    createMert({
      variables: {
        mert,
        fatherId,
      },
    });

  return (
    <Comment
      avatar={
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${username}`);
          }}
        >
          <Avatar size="large" src={picture || ""} alt={username || ""} />
        </div>
      }
      content={<Editor loading={loading} onSubmit={create} />}
    />
  );
};
