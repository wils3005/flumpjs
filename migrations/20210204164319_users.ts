import Knex, { SchemaBuilder } from "knex";

const tableName = "users";

function down(knex: Knex): SchemaBuilder {
  return knex.schema.dropTable(tableName);
}

function up(knex: Knex): SchemaBuilder {
  return knex.schema.createTable(tableName, (table) => {
    table.integer("id").primary();
    table.string("username").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
}

export { down, up };
