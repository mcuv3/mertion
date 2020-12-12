import { Breadcrumb, Layout, Menu, Button, Typography } from "antd";
import {
  UserOutlined,
  RadarChartOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

import Link from "next/link";
import { useLogOutMutation, useMeQuery } from "../generated/graphql";
import { withApollo } from "../lib/withApollo";
import { useApolloClient } from "@apollo/client";
const { Content, Footer, Header } = Layout;
const { Title } = Typography;

const Main: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const client = useApolloClient();
  const { data, loading } = useMeQuery();
  const [logout] = useLogOutMutation();

  const logOut = async () => {
    await logout();
    client.cache.evict({});
    router.push("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link passHref href="/">
          <div style={{ display: "flex", cursor: "pointer" }}>
            <RadarChartOutlined
              style={{ fontSize: "2.5rem", color: "white" }}
            />
            <Title
              style={{
                color: "white",
                fontStyle: "italic",
                marginTop: "1.2rem",
              }}
              level={5}
            >
              Mertion
            </Title>
          </div>
        </Link>
        {data?.me && !loading ? (
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            size="large"
            style={{ marginRight: "1rem" }}
            onClick={logOut}
          />
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
        )}
      </Header>
      <Content
        style={{
          padding: "2rem",
          flex: "1",
          margin: "auto",
          width: "720px",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Mertion ©2020 Created by mcuve
      </Footer>
    </Layout>
  );
};

export default Main;
