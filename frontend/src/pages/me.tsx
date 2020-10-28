import { withApollo } from "../lib/withApollo";
import Link from "next/link";

const Me = () => {
  return <Link href="/about">ME PAGE</Link>;
};

export default withApollo({ ssr: true })(Me);
