import { gql, useApolloClient } from "@apollo/client";
import { Card, Comment, Tooltip } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkAction } from "../common/checkAction";
import {
  Mert,
  Reactions,
  useMeQuery,
  useReactMertMutation,
} from "../generated/graphql";
import { isAuth } from "../util/checkAuth";
import { __prod__ } from "../util/constants";
import dayjs from "../util/dayjs";
import Actions from "./Actions";
import Reply from "./Reply";

interface Props {
  mert: Mert;
  isFather?: boolean;
  addFather?: (father: Mert) => void;
  fromUserMert?: boolean;
}

const MertComponent: React.FC<Props> = ({
  mert,
  isFather,
  addFather,
  fromUserMert,
}) => {
  const [likes, setLikes] = useState(mert.likes.length);
  const { data: me, loading: meLoading } = useMeQuery();
  const [dislikes, setDislikes] = useState(mert.dislikes.length);
  const [action, setAction] = useState<string | null>(null);
  const [reactMert] = useReactMertMutation();
  const [reply, setReply] = useState(false);
  const client = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    if (me?.me && !meLoading)
      setAction(checkAction(me, mert.dislikes, mert.likes));
    else setAction(null);
  }, [me?.me, meLoading]);

  const reaction = async (reaction: Reactions) => {
    const res = await reactMert({
      variables: { mertId: mert.id, reaction },
    });
    if (res.data?.reactMert) {
      setLikes(res.data.reactMert.likes.length);
      setDislikes(res.data.reactMert.dislikes.length);
      setAction((lastReact) => {
        console.log(lastReact, reaction);
        if (lastReact === reaction) return null;
        return reaction;
      });
    }
  };

  const successReply = (success: boolean) => {
    if (success) {
      client.cache.writeFragment({
        id: `Mert:${mert.id}`,
        fragment: gql`
          fragment _comments on Mert {
            comments
          }
        `,
        data: {
          comments: mert.comments + 1,
        },
      });
    }
    setReply(!reply);
  };

  return (
    <>
      <Card bodyStyle={{ padding: "0 1rem" }} hoverable>
        {reply && <Reply fatherMert={mert} close={successReply} />}
        <div
          onClick={() => {
            if (!fromUserMert)
              return router.push(
                `/[user]/[mert]`,
                `/${mert.user.username}/${mert.id}`
              );
            if (fromUserMert && addFather) return addFather(mert);
          }}
        >
          <Comment
            actions={Actions({
              reply: () => setReply((e) => !e),
              onClick: (react) => isAuth(router, me) && reaction(react),
              dislikes,
              likes,
              action,
              mert: mert,
            })}
            author={<a>{mert.user.username}</a>}
            avatar={
              <Image
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/[user]", `/${mert.user.username}`);
                }}
                width="50px"
                height="50px"
                src={
                  (__prod__
                    ? mert?.user?.picture
                    : mert?.user?.picture?.replace("localhost", "app")) || ""
                }
                alt={mert.user.username || ""}
              />
            }
            content={
              <>
                <p style={{ marginBottom: "1rem" }}>{mert.mert}</p>
                <div>
                  {mert.picture && (
                    <div className="mertImage">
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
      {isFather && mert.comments > 0 && (
        <div className="vertical_dotted_line"></div>
      )}
    </>
  );
};

export default MertComponent;
