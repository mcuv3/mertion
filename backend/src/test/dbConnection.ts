import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { Mert, User } from "../entities";

export let db: Connection;

const connection = {
  async create() {
    const options = await getConnectionOptions("test");
    // console.log(options);
    db = await createConnection({
      type: "postgres",
      url: "postgresql://postgres:postgres@localhost:5432/test",
      synchronize: true,
      entities: [User, Mert],
    });
    const res = await db
      .getRepository(User)
      .createQueryBuilder()
      .select("*")
      .getOne();
    console.log(res);
  },

  async close() {
    // return getConnection("test").close();
  },

  async clear() {},
};
export default connection;
