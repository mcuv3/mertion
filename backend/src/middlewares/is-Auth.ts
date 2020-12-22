import { AuthChecker, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";

export const customAuthChecker: AuthChecker<MyContext> = (
  { root, args, context, info },
  roles
) => {
  if (!context.req.session.userId) return false;
  return true;
};
