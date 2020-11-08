import "reflect-metadata";
import "dotenv-safe/config";
import Redis from "ioredis";
import cors from "cors";
import { createConnection } from "typeorm";
import express from "express";
import connectRedis from "connect-redis";
import session from "express-session";
import {
  DATABASE_URL,
  REDIS_URL,
  ORIGIN,
  COOKIE_NAME,
  SESSION_SECRET,
  PORT,
  __prod__,
} from "./constants";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Auth } from "./resolvers/Auth";
import { User, Mert } from "./entities/index";
import { graphqlUploadExpress } from "graphql-upload";
import { customAuthChecker } from "./middlewares/is-Auth";
import { MertsResolver } from "./resolvers/Merts";
import {
  ApolloServerPluginUsageReporting,
  AuthenticationError,
} from "apollo-server-core";
import { mertLoader } from "./DataLoader/MertLoader";
import { MyContext } from "./types";

const main = async () => {
  // SET UP CONNECTION TO THE DATABASE THROUGH TYPEORM
  const db = await createConnection({
    type: "postgres",
    entities: [User, Mert],
    url: DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  const app = express();
  app.use(express.static(path.join(__dirname, "public")));

  const RedisStore = connectRedis(session);
  const redis = new Redis(REDIS_URL);

  app.set("trust proxy", 1);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".mydomain.com" : undefined,
      },
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    uploads: false,

    schema: await buildSchema({
      authChecker: customAuthChecker,
      resolvers: [Auth, MertsResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({
      db,
      req,
      res,
      redis,
      mertLoader: mertLoader(),
    }),
    formatError: (err) => {
      console.log(err);
      // Don't give the specific errors to the client.
      if (err.message.startsWith("Access denied")) {
        return { success: false, message: "Not Authorized" };
      }
      // Otherwise return the original error.  The error can also
      // be manipulated in other ways, so long as it's returned.
      return err;
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, (e) => {
    console.log(`Available at http://localhost:${PORT}/graphql`);
  });
};

main().catch((e) => {
  console.log(e);
  console.error("CANNOT INITIALIZE THE SERVER");
});

process.on("unhandledRejection", () => {
  process.exit();
});
