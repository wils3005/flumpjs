import { join } from "path";

// https://knexjs.org

// knex migrate:list
// knex migrate:make migration_name
// knex migrate:up
// knex migrate:up 001_migration_name.js
// knex migrate:latest
// knex migrate:down
// knex migrate:down 001_migration_name.js
// knex migrate:rollback
// knex migrate:rollback --all

// knex seed:make seed_name
// knex seed:run
// knex seed:run --specific=seed-filename.js

const development = {
  client: "sqlite3",
  connection: { filename: "development.sqlite3" },
  migrations: {
    extension: "ts",
  },
  seeds: { directory: join(process.cwd(), "seeds") },
  useNullAsDefault: true,
};

const test = {
  ...development,
  connection: { filename: ":memory:" },
};

const staging = {
  ...development,
  connection: { filename: "staging.sqlite3" },
};

const production = {
  ...development,
  connection: { filename: "production.sqlite3" },
};

export { development, test, staging, production };
