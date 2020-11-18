import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox } from "antd";

import { withApollo } from "../lib/withApollo";
import { useFormErrors } from "../hooks/useFormErrors";
import {
  LoginMutationVariables,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../generated/graphql";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const [login, { data, loading }] = useLoginMutation({
    notifyOnNetworkStatusChange: true,
    update: (cache, { data }) => {
      if (data?.logIn.success)
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: {
              email: data.logIn.email,
              picture: data.logIn.picture,
              username: data.logIn.username,
              age: data.logIn.age,
              about: data.logIn.about,
              name: data.logIn.name,
              id: data.logIn.id,
            },
          },
        });
    },
  });
  const router = useRouter();
  const { form } = useFormErrors({
    response: data?.logIn,
    success: () => {
      const next = router.query.next;
      if (typeof next === "string") router.push(next);
      else router.push("/");
    },
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
