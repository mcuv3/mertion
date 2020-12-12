import { Button, Form, Input } from "antd";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { updateUser } from "../../common/updateUser";
import SelectUpload from "../../components/SelectUpload";
import {
  UpdateProfileMutationVariables,
  useMeQuery,
  useUpdateProfileMutation,
} from "../../generated/graphql";
import { useFormErrors } from "../../hooks/useFormErrors";
import { withApollo } from "../../lib/withApollo";
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
      updateUser({ cache, data, form, me });
    },
  });
  const { form } = useFormErrors({
    success: () => {},
    response: data?.changeProfile,
  });

  useEffect(() => {
    if (!meLoading) {
      const currentUser = router.query.user === me?.me?.username;
      if (!currentUser) {
        console.log(me?.me);
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
    }
  }, [meLoading]);

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
    <div className="configContainer">
      <div className="formConfigContainer">
        <div className="imagesConfig">
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
        <Form {...layout} size="middle" form={form} className="fullWidth">
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
