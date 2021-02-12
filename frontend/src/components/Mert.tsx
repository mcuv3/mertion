import { gql, useApolloClient } from "@apollo/client";
import { Card, Comment } from "antd";
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
import Actions from "./Actions";
import { DateMert } from "./mert/DateMert";
import { LinkedMert } from "./mert/LinkedMert";
import { MertContent } from "./mert/MertContent";
import Reply from "./Reply";
import { UserAvatar } from "./user/UserAvatar";

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
              <UserAvatar
                picture={mert?.user?.picture}
                username={mert?.user?.username}
              />
            }
            content={
              <MertContent
                mert={mert.mert}
                mertId={mert.id}
                picture={mert.picture}
              />
            }
            datetime={<DateMert createdAt={+mert.createdAt} />}
          />
        </div>
      </Card>
      <LinkedMert isFather={isFather} numComments={mert.comments} />
    </>
  );
};

export default MertComponent;
