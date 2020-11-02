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
    update: (cache, { data }) => {
      if (data?.createMert.success) {
        const merts = cache.readQuery<MertsQuery>({
          query: MertsDocument,
          variables: { cursor: null, mertId: null },
        });
        const mert = data.createMert.mert;
        console.log(mert);

        cache.writeQuery<MertsQuery>({
          query: MertsDocument,
          variables: { cursor: null, mertId: null },
          data: {
            merts: [{ ...mert } as Mert, ...(merts?.merts || [])],
          },
        });
      }
    },
  });
  const create = (mert: string) => {
    createMert({
      variables: {
        mert,
        fatherId,
      },
    });
  };

  return (
    <Comment
      //   actions={[
      //     <Tooltip key="comment-basic-like" title="icons">
      //       <SmileOutlined />
      //     </Tooltip>,
      //     <Tooltip key="comment-basic-like" title="picture">
      //       <PictureOutlined />
      //     </Tooltip>,
      //   ]}
      avatar={
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${username}`);
          }}
        >
          {" "}
          <Avatar size="large" src={picture || ""} alt={username || ""} />
        </div>
      }
      content={<Editor loading={loading} onSubmit={create} />}
    />
  );
};
