import { AuthChecker, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";

export const customAuthChecker: AuthChecker<MyContext> = (
  { root, args, context, info },
  roles
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  if (!context.req.session.userId) return false;

  return true; // or false if access is denied
};
