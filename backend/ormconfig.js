module.exports = {
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "test",
  dropSchema: true,
  logging: false,
  synchroize: true,
  migrationsRun: true,

  entities: ["src/database/entities/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  cli: {
    entitiesDir: "src/database/entities",
    migrationsDir: "src/database/migrations",
  },
};
