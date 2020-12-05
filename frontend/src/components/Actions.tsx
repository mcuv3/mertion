import React, { createElement, useEffect, useState } from "react";
import { Avatar, Card, Comment, Space, Tooltip } from "antd";
import dayjs from "../util/dayjs";
import Image from "next/image";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
  MessageOutlined,
} from "@ant-design/icons";
import {
  MeQuery,
  MeResponse,
  Mert,
  Reactions,
  useMeQuery,
  useReactMertMutation,
} from "../generated/graphql";
import { useRouter } from "next/router";

import Reply from "./Reply";
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
          e.preventDefault();
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
          e.preventDefault();
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
      <span
      // onClick={(e) => isAuth(router, me) && reaction(e, Reactions.DisLike)}
      >
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
