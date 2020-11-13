import React, { useEffect } from "react";
import { withApollo } from "../../lib/withApollo";
import Image from "next/image";
import { useMeQuery } from "../../generated/graphql";
import { Button, Form, Input } from "antd";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { useFormErrors } from "../../hooks/useFormErrors";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

export const ConfigUser = ({ router }: WithRouterProps) => {
  const { data: me } = useMeQuery();

  const { form } = useFormErrors({ success: () => {}, response: {} });

  useEffect(() => {
    if (router.query.user !== me?.me?.username) {
      router.push("/");
    }
    form.setFields([
      { name: "username", value: me?.me?.username },
      { name: "name", value: me?.me?.name },
      { name: "about", value: me?.me?.about },
    ]);
  }, []);

  console.log(me?.me);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Image
          src={me?.me?.picture?.replace("localhost", "app") || ""}
          height={250}
          width={250}
        />
        <Form {...layout} size="middle" form={form} style={{ width: "100%" }}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item name="about" label="About me">
            <Input.TextArea placeholder="About you" />
          </Form.Item>
        </Form>
      </div>
      <Button>Update Profile</Button>
    </div>
  );
};

export default withApollo({ ssr: true })(withRouter(ConfigUser));
