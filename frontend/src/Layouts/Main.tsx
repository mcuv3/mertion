import { useApolloClient } from "@apollo/client";
import { Grid, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import { MertionLogo } from "../components/navigation/MertionLogo";
import { NavigationOptions } from "../components/navigation/NavigationOptions";
import { useLogOutMutation, useMeQuery } from "../generated/graphql";
import styles from "../styles/navigation.module.css";

const { Content, Footer, Header } = Layout;
const { Title } = Typography;

const { useBreakpoint } = Grid;

const Main: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const client = useApolloClient();
  const { data, loading } = useMeQuery();
  const [logout] = useLogOutMutation();
  const br = useBreakpoint();
  const logOut = async () => {
    await logout();
    client.cache.evict({});
    router.push("/");
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header className={styles.header}>
        <MertionLogo />
        <NavigationOptions logOut={logOut} />
      </Header>
      <Content
        style={{
          padding: "2rem",
          flex: "1",
          margin: "auto",
          width:
            (!br.md && br.sm) || (!br.md && br.sm) || (!br.sm && !br.md)
              ? "100%"
              : "768px",
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
