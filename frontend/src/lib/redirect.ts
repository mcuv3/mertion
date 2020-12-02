import { NextPageContext } from "next";
import Router from "next/router";

export default (ctx: NextPageContext, path: string) => {
  if (ctx.res) {
    ctx.res.writeHead(303, { Location: path + ctx.pathname });
    ctx.res.end();
  } else {
    Router.replace(path);
    Router.query.next = ctx.pathname;
  }
};
