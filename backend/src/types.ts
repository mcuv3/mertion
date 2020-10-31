import { Request, Response, Express } from "express";
import { Connection } from "typeorm";
import { Stream } from "stream";
export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  db: Connection;
};

export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
};
