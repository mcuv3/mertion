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
  mert: Mert;
  isFather?: boolean;
}

const checkAction = (
  me: MeQuery,
  dislikes?: string[],
  likes?: string[]
): string | null => {
  if (new Set(likes).has(me?.me?.id || "")) return "liked";
  if (new Set(dislikes).has(me?.me?.id || "")) return "disliked";
  return null;
};

const MertComponent: React.FC<Props> = ({ mert, isFather }) => {
  const [likes, setLikes] = useState(mert.likes.length);
  const { data: me, loading: meLoading } = useMeQuery();
  const [dislikes, setDislikes] = useState(mert.dislikes.length);
  const [action, setAction] = useState<string | null>(null);
  const [reactMert] = useReactMertMutation();
  const [reply, setReply] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (me?.me && !meLoading)
      setAction(checkAction(me, mert.dislikes, mert.likes));
    else setAction(null);
  }, [me?.me, meLoading]);

  const reaction = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    reaction: Reactions
  ) => {
    e.stopPropagation();
    const res = await reactMert({
      variables: { mertId: mert.id, reaction },
    });
    if (res.data?.reactMert) {
      setLikes(res.data.reactMert.likes.length);
      setDislikes(res.data.reactMert.dislikes.length);
      setAction(reaction == Reactions.Like ? "liked" : "disliked");
    }
  };

  const IconText = ({ icon, text }: { icon: any; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const actions = React.useMemo(
    () => [
      <Tooltip key="comment-basic-like" title="Like">
        <span
          onClick={(e) => isAuth(router, me) && reaction(e, Reactions.Like)}
        >
          {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
          <span className="comment-action">{likes}</span>
        </span>
      </Tooltip>,
      <Tooltip key="comment-basic-dislike" title="Dislike">
        <span
          onClick={(e) => isAuth(router, me) && reaction(e, Reactions.DisLike)}
        >
          {React.createElement(
            action === "disliked" ? DislikeFilled : DislikeOutlined
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
          if (isAuth(router, me, `${mert.user.username}/${mert.id}`))
            setReply((r) => !r);
        }}
      >
        Reply to
      </span>,
    ],
    [likes, dislikes, action]
  );
  return (
    <Card hoverable>
      {reply && <Reply fatherMert={mert} close={() => setReply(!reply)} />}
      <div
        onClick={() => {
          if (isFather) return;
          router.push(`/[user]/[mert]`, `/${mert.user.username}/${mert.id}`);
        }}
      >
        <Comment
          //  style={{ border: "1px solid #ccc", padding: "0 1rem" }}
          actions={actions}
          author={<a>{mert.user.username}</a>}
          avatar={
            <Image
              onClick={(e) => {
                e.stopPropagation();
                router.push("/[user]", `/${mert.user.username}`);
              }}
              width="50px"
              height="50px"
              src={mert?.user?.picture?.replace("localhost", "app") || ""}
              alt={mert.user.username || ""}
            />

            // <Avatar
            //   src={mert.user.picture || ""}
            //   alt={mert.user.username || ""}
            // />
          }
          content={
            <>
              <p style={{ marginBottom: "1rem" }}>{mert.mert}</p>

              <div>
                {mert.picture && (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "600px",
                      display: "flex",
                    }}
                  >
                    <Image
                      alt={mert.id}
                      src={mert.picture?.replace("localhost", "app") || ""}
                      width={400}
                      height={500}
                      quality={100}
                      //sizes="(max-width: 600px) 100vw, (max-width: 1023px) 48vw, 18vw,(max-height: 500px) 1000px"
                    />
                  </div>
                )}
              </div>
            </>
          }
          datetime={
            <Tooltip title={dayjs().from(dayjs(new Date(+mert.createdAt)))}>
              <span>{dayjs().from(dayjs(new Date(+mert.createdAt)))}</span>
            </Tooltip>
          }
        />
      </div>
    </Card>
  );
};

export default MertComponent;
