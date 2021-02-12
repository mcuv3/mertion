import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";
import { useMeQuery, useUserQuery } from "../generated/graphql";
import { checkUrlImage } from "../lib/checkUrlImage";
const { Meta } = Card;

const URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
    : "http://localhost:4000/backgrounds";

const UserInfo = ({ router }: WithRouterProps) => {
  const { data: user, loading } = useUserQuery({
    variables: {
      username:
        typeof router.query.user === "string" ? router.query.user : null,
    },
  });

  const { data: me } = useMeQuery();

  if (!user && !loading) router.push("/404");
  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <img
          style={{}}
          alt="example"
          src={
            checkUrlImage(
              "/backgrounds/default.jpg",
              me?.me?.backgroundPicture as string
            ) as string
          }
        />
      }
      actions={
        me?.me && me?.me?.username === router.query.user
          ? [
              <SettingOutlined
                onClick={() => {
                  router.push(`/[user]/config`, `/${me.me?.username}/config`);
                }}
                key="setting"
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]
          : []
      }
    >
      <Meta
        avatar={<Avatar src={user?.user?.picture || ""} />}
        title={`${user?.user?.name} - ${user?.user?.username}`}
        description={
          <>
            <Typography style={{ marginBottom: "1rem" }}>
              {user?.user?.email}
            </Typography>
            <Typography style={{ fontStyle: "italic" }}>
              "{user?.user?.about}"
            </Typography>
          </>
        }
      />
    </Card>
  );
};

export default withRouter(UserInfo);
