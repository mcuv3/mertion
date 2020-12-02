import React, { useEffect, useState } from "react";
import { withApollo } from "../../lib/withApollo";
import {
  MertsDocument,
  MertsQuery,
  UpdateProfileMutationVariables,
  useMeQuery,
  UserDocument,
  UserQuery,
  useUpdateProfileMutation,
} from "../../generated/graphql";
import { Button, Form, Input } from "antd";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { useFormErrors } from "../../hooks/useFormErrors";
import SelectUpload from "../../components/SelectUpload";
import { gql } from "@apollo/client";
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

export const ConfigUser = ({ router }: WithRouterProps) => {
  const { data: me, loading: meLoading } = useMeQuery();
  const [image, setImage] = useState<{ url: string; file?: Blob }>();
  const [imageBg, setImageBg] = useState<{ url: string; file?: Blob }>();
  const [updateProfile, { data }] = useUpdateProfileMutation({
    update: (cache, { data }) => {
      if (data?.changeProfile.success && me?.me) {
        const fragments = {
          fragment: gql`
            fragment _user on User {
              about
              name
              picture
              username
              backgroundPicture
            }
          `,
          data: {
            about: form.getFieldValue("about"),
            name: form.getFieldValue("name"),
            picture: data.changeProfile.picture || me.me.picture,
            username: form.getFieldValue("username"),
            backgroundPicture:
              data.changeProfile.backgroundImageUrl || me.me.backgroundPicture,
            age: form.getFieldValue("age"),
          },
        };
        cache.writeFragment({
          id: "User:" + me.me.id,
          ...fragments,
        });

        cache.writeFragment({
          id: "MeResponse:" + me.me.id,
          ...fragments,
          fragment: gql`
            fragment _me on MeResponse {
              about
              name
              age
              picture
              username
              backgroundPicture
            }
          `,
        });
      }
    },
  });
  const { form } = useFormErrors({
    success: () => {},
    response: data?.changeProfile,
  });
  useEffect(() => {
    if (router.query.user !== me?.me?.username && !meLoading) {
      router.push("/");
    } else if (me?.me) {
      form.setFields([
        { name: "username", value: me?.me?.username },
        { name: "name", value: me?.me?.name },
        { name: "about", value: me?.me?.about },
        { name: "age", value: me?.me?.age },
      ]);
      setImage({ url: me!.me!.picture as string });
      setImageBg({ url: me.me.backgroundPicture as string });
    }
  }, [me?.me]);

  const onFinish = async (fields: UpdateProfileMutationVariables) =>
    updateProfile({
      variables: {
        ...fields,
        age: +fields.age || 0,
        picture: image?.file,
        bg_picture: imageBg?.file,
      },
    });

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <SelectUpload
            label="Profile Photo"
            image={image}
            setImage={setImage}
            key={1}
          />
          <SelectUpload
            label="Background Photo"
            image={imageBg}
            setImage={setImageBg}
            key={2}
          />
        </div>
        <Form {...layout} size="middle" form={form} style={{ width: "100%" }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input placeholder="18+" />
          </Form.Item>
          <Form.Item name="about" label="About me">
            <Input.TextArea
              placeholder="About you"
              maxLength={255}
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </div>
      <Button type="primary" onClick={() => onFinish(form.getFieldsValue())}>
        Update Profile
      </Button>
    </div>
  );
};

export default withApollo({ ssr: false })(withRouter(ConfigUser));
