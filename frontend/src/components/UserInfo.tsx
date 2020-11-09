import { Avatar, Card, Typography } from "antd";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import React from "react";
import { useMeQuery, useMertQuery, useUserQuery } from "../generated/graphql";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { route } from "next/dist/next-server/server/router";
const { Meta } = Card;
interface Props {}

const UserInfo = ({ router }: WithRouterProps) => {
  const { data: user } = useUserQuery({
    variables: {
      username:
        typeof router.query.user === "string" ? router.query.user : null,
    },
  });

  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src="http://localhost:4000/backgrounds/default.jpg"
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
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
