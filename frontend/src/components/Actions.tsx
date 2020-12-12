import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { Mert, Reactions, useMeQuery } from "../generated/graphql";
import { isAuth } from "../util/checkAuth";

interface Props {
  likes: number;
  dislikes: number;
  action: string | null;
  mert: Mert;
  onClick: (reaction: Reactions) => void;
  reply: () => void;
}

const Actions = ({ action, likes, mert, dislikes, onClick, reply }: Props) => {
  const router = useRouter();
  const me = useMeQuery();
  return [
    <Tooltip key="comment-basic-like" title="Like">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClick(Reactions.Like);
        }}
      >
        {action === Reactions.Like ? <LikeFilled /> : <LikeOutlined />}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClick(Reactions.DisLike);
        }}
      >
        {React.createElement(
          action === Reactions.DisLike ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Comments">
      <span>
        {React.createElement(MessageOutlined)}
        <span className="comment-action">{mert.comments}</span>
      </span>
    </Tooltip>,
    <span
      key="comment-basic-reply-to"
      onClick={(e: any) => {
        e.stopPropagation();
        if (isAuth(router, me.data, `${mert.user.username}/${mert.id}`))
          reply();
      }}
    >
      Reply to
    </span>,
  ];
};

export default Actions;
