import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

export const NotFound = () => {
  return (
    <Result
      style={{ margin: "auto" }}
      status="404"
      title="Maybe try later"
      subTitle="Sorry, something went wrong."
      extra={
        <Link href="/" passHref>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};
