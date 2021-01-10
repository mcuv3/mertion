module.exports = {
  name: "test",
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

  entities: ["./src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
  },
};
