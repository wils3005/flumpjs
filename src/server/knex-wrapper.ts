import * as Zod from "zod";
import Knex from "knex";
import Path from "path";
import User from "./user";

class KnexWrapper {
  env = Zod.object({
    NODE_ENV: Zod.string(),
  }).parse(process.env);

  knex = Knex({
    client: "sqlite3",
    connection: {
      filename: Path.join(process.cwd(), `${this.env.NODE_ENV}.sqlite3`),
    },
    useNullAsDefault: true,
  });

  constructor() {
    User.knex(this.knex);
  }
}

export default KnexWrapper;
