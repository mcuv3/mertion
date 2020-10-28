import { withApollo } from "../lib/withApollo";
import Link from "next/link";
import { CustomButton } from "../components/Button";
import { GetServerSideProps } from "next";
import { withAuth } from "../HOC/withAuth";
import { useIsAuth } from "../lib/useIsAuth";
import { action } from "mobx";
import { Sample } from "../components/Sample";

const About = ({}) => {
  // const { loading } = useIsAuth();
  return (
    <>
      <Sample />
      <Link href="/me">ABOUT PAGE</Link>
      <CustomButton />
    </>
  );
};

export default withApollo({ ssr: false })(About);
