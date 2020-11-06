import React, { createElement, useState } from "react";
import { Comment, Tooltip } from "antd";
import dayjs from "../util/dayjs";
import Image from "next/image";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import {
  Mert,
  Reactions,
  useMeQuery,
  useReactMertMutation,
} from "../generated/graphql";
import { withApollo } from "../lib/withApollo";
import { useRouter } from "next/router";

import Reply from "./Reply";
import { isAuth } from "../util/checkAuth";

interface Props {
  mert: Mert;
  isFather?: boolean;
}

const MainPost: React.FC<Props> = ({ mert, isFather }) => {
  const [likes, setLikes] = useState(mert.likes.length);
  const [dislikes, setDislikes] = useState(mert.dislikes.length);
  const [action, setAction] = useState<string | null>(null);
  const [reactMert, { data }] = useReactMertMutation();
  const [reply, setReply] = useState(false);
  const { data: me } = useMeQuery();

  const router = useRouter();

  const like = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    const res = await reactMert({
      variables: { mertId: mert.id, reaction: Reactions.Like },
    });
    if (res.data?.reactMert) {
      setLikes(res.data.reactMert.likes.length);
      setDislikes(res.data.reactMert.dislikes.length);
      setAction("liked");
    }
  };

  const dislike = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    const res = await reactMert({
      variables: { mertId: mert.id, reaction: Reactions.DisLike },
    });
    if (res.data?.reactMert) {
      setLikes(res.data.reactMert.likes.length);
      setDislikes(res.data.reactMert.dislikes.length);
      setAction("liked");
    }
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={(e) => isAuth(router, me) && like(e)}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={(e) => isAuth(router, me) && dislike(e)}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span
      key="comment-basic-reply-to"
      onClick={(e: any) => {
        e.stopPropagation();
        if (isAuth(router, me, `${mert.user.username}/${mert.id}`))
          setReply((r) => !r);
      }}
    >
      Reply to
    </span>,
  ];
  return (
    <>
      {reply && <Reply fatherMert={mert} close={() => setReply(!reply)} />}
      <div
        onClick={() => {
          if (isFather) return;
          router.push(
            `/[user]/[mert]`,
            `/${mert.user.username}/${mert.id}`,
            {}
          );
        }}
      >
        <Comment
          style={{ border: "1px solid #ccc", padding: "0 1rem" }}
          actions={actions}
          author={<a>{mert.user.username}</a>}
          avatar={
            <Image
              width="50px"
              height="50px"
              src={mert.user.picture || ""}
              alt={mert.user.username || ""}
            />

            // <Avatar
            //   src={mert.user.picture || ""}
            //   alt={mert.user.username || ""}
            // />
          }
          content={<p>{mert.mert}</p>}
          datetime={
            <Tooltip title={dayjs().from(dayjs(new Date(+mert.createdAt)))}>
              <span>{dayjs().from(dayjs(new Date(+mert.createdAt)))}</span>
            </Tooltip>
          }
        />
      </div>
    </>
  );
};

export default withApollo({ ssr: false })(MainPost);
