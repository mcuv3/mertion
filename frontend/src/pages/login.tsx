import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox } from "antd";

import { withApollo } from "../lib/withApollo";
import { useFormErrors } from "../hooks/useFormErrors";
import { LoginMutationVariables, useLoginMutation } from "../generated/graphql";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const [login, { data, loading }] = useLoginMutation();
  const router = useRouter();
  const { form } = useFormErrors({
    response: data?.logIn,
    success: () => router.push("/"),
  });
  const onFinish = async (values: LoginMutationVariables) =>
    login({ variables: values });

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withApollo({ ssr: true })(Login);
