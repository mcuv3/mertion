import React from "react";
import Link from "next/link";
import { Typography } from "antd";

const { Link: LinkAntd, Title } = Typography;

export const NoMerts = () => {
  return (
    <div className="noMertsSvg">
      <img className="noMerts" src="/assets/no_merts.svg" />
      <Title level={3}>
        <Link passHref href="/">
          <LinkAntd>Add some merts</LinkAntd>
        </Link>
      </Title>
    </div>
  );
};
