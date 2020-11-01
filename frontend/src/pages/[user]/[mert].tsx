import { withApollo } from "../../lib/withApollo";

const Post = () => {
  return <h1>POST 1</h1>;
};

export default withApollo({ ssr: false })(Post);
