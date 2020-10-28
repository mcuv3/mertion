import React from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import redirect from "../lib/redirect";

export const withAuth = (WrappedComponent: React.FC) => {
  const hocComponent = ({ ...props }) => {
    return <WrappedComponent {...props} />;
  };
  hocComponent.getInitialProps = async (ctx: NextPageContext) => {
    const response = await new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });

    if (!response) {
      redirect(ctx, "/login?next=");
      return {
        me: null,
      };
    }
    return {
      me: true,
    };
  };

  return hocComponent;
};
