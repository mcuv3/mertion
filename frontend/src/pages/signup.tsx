import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { useRouter } from "next/router";
import { useState } from "react";
import { Features } from "../components/Features";
import {
  SignUpMutationVariables,
  useSignUpMutation,
} from "../generated/graphql";
import { useFormErrors } from "../hooks/useFormErrors";
import { withApollo } from "../lib/withApollo";
import { beforeUpload, getBase64 } from "../validation/validation";

const layout = {
  width: "100%",
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not validate email!",
    number: "${label} is not a validate number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const SingUp = () => {
  const [loading, setLoading] = useState(false);
  const [singUp, { data }] = useSignUpMutation();
  const [image, setImage] = useState<{ url: string; file?: Blob }>();
  const { form } = useFormErrors({
    response: data?.signUp,
    success: () => router.push("/login"),
  });

  const router = useRouter();

  const onFinish = async (fields: SignUpMutationVariables) =>
    singUp({
      variables: {
        ...fields,
        age: fields.age || 0,
        picture: image?.file,
      },
    });

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImage({
          file: info.file.originFileObj,
          url: imageUrl,
        });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Profile photo</div>
    </div>
  );

  return (
    <div className="expanded">
      <div className="features">
        <Features />
      </div>
      <div className="form-right">
        <div className="signUpAvatar">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            multiple={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {image?.url ? (
              <img src={image?.url} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Some Name ..." />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", required: true }]}
          >
            <Input placeholder="example@test.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="ej 1234." />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input placeholder="me123" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ type: "number", min: 0, max: 99 }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item name="about" label="Description">
            <Input.TextArea placeholder="About me ..." />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(SingUp);
