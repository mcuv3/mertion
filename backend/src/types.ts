import { Request, Response, Express } from "express";
import Redis from "ioredis";
import { Connection } from "typeorm";
import { Stream } from "stream";
import { mertLoader } from "./DataLoader/MertLoader";

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  db: Connection;
  redis: Redis.Redis;
  mertLoader: ReturnType<typeof mertLoader>;
};

export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
};

export type UserCookie = {
  email: string;
  username: string;
  picture: string;
};
