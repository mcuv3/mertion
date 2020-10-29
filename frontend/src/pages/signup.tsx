import { Form, Input, InputNumber, Button, Upload } from "antd";
import { beforeUpload, getBase64 } from "../validation/validation";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import st from "../styles/auth.module.css";
import { useState } from "react";
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
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImage] = useState();
  const onFinish = (values) => {
    console.log(values);
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setState(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setState(false), setImage(imageUrl);
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
    <div className={st.authContainer}>
      <div
        style={{
          width: "10%",
          margin: "1rem auto",
        }}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
      <Form
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

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="About me ..." />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SingUp;
