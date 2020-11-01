import { Comment, Avatar, Tooltip } from "antd";
import { MeResponse } from "../generated/graphql";
const {} = Comment;
import React from "react";
import { Editor } from "./Editor";
import { useRouter } from "next/router";

export const AddPost = ({ username, picture }: MeResponse) => {
  const router = useRouter();
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
      content={<Editor loading={false} onSubmit={(v) => console.log(v)} />}
    />
  );
};
