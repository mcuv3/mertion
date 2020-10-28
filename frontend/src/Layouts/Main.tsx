import { Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import SubMenu from "antd/lib/menu/SubMenu";
import React, { PropsWithChildren } from "react";
import Link from "next/link";
const { Content, Footer, Header } = Layout;

export const Main: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Layout>
      <Header className="header">
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Menu.Item key="1">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/about">
              <a>About</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/me">
              <a>Me</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 15", flex: "1", margin: "auto 0 " }}>
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Selling Point ©2018 Created by mcuve
      </Footer>
    </Layout>
  );
};
