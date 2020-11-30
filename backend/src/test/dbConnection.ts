import { createConnection, getConnection } from "typeorm";
import { DATABASE_URL } from "../constants";
import { Mert, User } from "../entities";

const connection = {
  async create() {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "test",
      dropSchema: true,
      logging: false,
      synchronize: true,
      entities: ["src/database/entities/*.ts"],
    });
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};
export default connection;
