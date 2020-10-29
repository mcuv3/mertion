import { Breadcrumb, Layout, Menu, Button, Typography } from "antd";
import {
  UserOutlined,
  RadarChartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

import Link from "next/link";
const { Content, Footer, Header } = Layout;
const { Title } = Typography;
export const Main: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
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
          <RadarChartOutlined style={{ fontSize: "2.5rem", color: "white" }} />
        </Link>
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
      </Header>
      <Content
        style={{
          padding: "2rem",
          flex: "1",
          margin: "auto",
          width: "720px",
          height: "100%",
          display: "flex",
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Mertion ©2018 Created by mcuve
      </Footer>
    </Layout>
  );
};
