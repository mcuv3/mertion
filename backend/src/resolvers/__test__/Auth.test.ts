import { ApolloServer, gql } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { buildSchema } from "type-graphql";
import { mertLoader } from "../../DataLoader/MertLoader";
import { customAuthChecker } from "../../middlewares/is-Auth";
import { db } from "../../test/dbConnection";
import { MyContext } from "../../types";
import { Auth } from "../AuthResolver";
import { MertsResolver } from "../MertResolver";
import { UserResolver } from "../UserResolver";

const initGraphqlServer = async () => {
  const apolloServer = new ApolloServer({
    uploads: false,
    subscriptions: {
      path: "/subscriptions",
    },
    schema: await buildSchema({
      authChecker: customAuthChecker,
      resolvers: [Auth, MertsResolver, UserResolver],

      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({
      db,
      req,
      res,
      mertLoader: mertLoader(),
    }),
  });

  const { mutate, query } = createTestClient(apolloServer);

  return { mutate, query };
};

it("Creates an user without the image", async () => {
  const res = await initGraphqlServer();
  const { mutate } = res;

  const CREATE_USER = gql`
    mutation {
      signUp(
        profile_picture: null
        fields: {
          username: "mcuve"
          name: "Maricio"
          age: 23
          email: "mcuve@outlook.com"
          password: "adjhfalsd"
          about: "difsadopifujasd"
        }
      ) {
        message
        errors {
          field
          error
        }
        success
      }
    }
  `;
  const response = await mutate({
    mutation: CREATE_USER,
  });

  console.log(response);
});
