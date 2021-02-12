import { RadarChartOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Link from "next/link";
import React from "react";
import styles from "../../styles/navigation.module.css";
export const MertionLogo = () => {
  return (
    <Link passHref href="/">
      <div className={styles.logo}>
        <RadarChartOutlined className={styles.logoIcon} />
        <Title
          className={styles.logoTitle}
          style={{ color: "white" }}
          level={5}
        >
          Mertion
        </Title>
      </div>
    </Link>
  );
};
