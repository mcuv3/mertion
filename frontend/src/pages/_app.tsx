import { Main } from "../Layouts/Main";
import "../styles/antd.less";
import NextNprogress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: any) {
  return (
    <Main>
      <NextNprogress options={{ easing: "ease", speed: 500 }} />
      <Component {...pageProps} />
    </Main>
  );
}

export default MyApp;
