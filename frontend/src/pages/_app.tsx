import { Main } from "../Layouts/Main";
import "../styles/antd.less";

import { Provider } from "mobx-react";

function MyApp({ Component, pageProps }: any) {
  return (
    <Main>
      <Component {...pageProps} />
    </Main>
  );
}

export default MyApp;
