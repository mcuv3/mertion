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

const main = async () => {
  // SET UP CONNECTION TO THE DATABASE THROUGH TYPEORM
  await createConnection({
    type: "postgres",
    entities: [User, Mert],
    url: DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  const app = express();
  app.use(
    "/profile-pictures",
    express.static(path.join(__dirname, "public", "profile-pictures"))
  );

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
      resolvers: [Auth],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
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
