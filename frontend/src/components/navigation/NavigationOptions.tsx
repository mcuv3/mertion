import {
  LogoutOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "../../generated/graphql";
import styles from "../../styles/navigation.module.css";
import { UserAvatar } from "../user/UserAvatar";
interface Props {
  logOut(): void;
}

export const NavigationOptions = ({ logOut }: Props) => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  return data?.me && !loading ? (
    <div className={styles.userAuthenticated}>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        size="large"
        style={{ marginRight: "1rem" }}
        onClick={logOut}
      />
      <div style={{ marginTop: "2rem" }}>
        <UserAvatar
          picture={data.me.picture}
          username={data.me.username as string}
        />
      </div>
    </div>
  ) : (
    <div className="">
      <Button
        type="primary"
        icon={<UserOutlined />}
        size="large"
        style={{ marginRight: "1rem" }}
        onClick={() => {
          router.push("/login");
        }}
      >
        SingIn
      </Button>
      <Button
        icon={<UsergroupAddOutlined />}
        size="large"
        onClick={() => {
          router.push("/signup");
        }}
      >
        SignUp
      </Button>
    </div>
  );
};
