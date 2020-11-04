import React, { createElement, useState } from "react";
import { useStore } from "../store/index";
import { Comment, Tooltip, Avatar } from "antd";
import dayjs from "../util/dayjs";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import { Mert, useMeQuery } from "../generated/graphql";
import { withApollo } from "../lib/withApollo";
import { useRouter } from "next/router";
import me from "../pages/me";
import Reply from "./Reply";

interface Props {
  mert: Mert;
}

const MainPost: React.FC<Props> = ({ mert }) => {
  const [likes, setLikes] = useState(mert.likes);
  const [dislikes, setDislikes] = useState(mert.dislikes);
  const [action, setAction] = useState<string | null>(null);
  const [reply, setReply] = useState(false);
  const { mertStore } = useStore();

  const router = useRouter();

  const like = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to" onClick={() => setReply(!reply)}>
      Reply to
    </span>,
  ];

  return (
    <>
      {reply && <Reply fatherMert={mert} close={() => setReply(!reply)} />}
      <div
        onClick={() => {
          mertStore.setMert(mert);
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
            <Avatar
              src={mert.user.picture || ""}
              alt={mert.user.username || ""}
            />
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

export default MainPost;
