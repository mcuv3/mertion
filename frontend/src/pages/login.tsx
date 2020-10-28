import { Button } from "antd";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  console.log(router);
  return (
    <div>
      <h1>Login Page</h1>
      <Button
        onClick={() => {
          const path = router.query?.next;
          console.log(path);
          if (typeof path === "string") router.push(path);
          else router.push("/");
        }}
      >
        Log In
      </Button>
    </div>
  );
};

export default Login;
