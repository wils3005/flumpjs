import * as Zod from "zod";
import Base from "./base";
import Knex from "knex";
import Path from "path";
import User from "./user";

class KnexWrapper extends Base {
  readonly env = Zod.object({
    NODE_ENV: Zod.string(),
  }).parse(process.env);

  readonly knex = Knex({
    client: "sqlite3",
    connection: {
      filename: Path.join(process.cwd(), `${this.env.NODE_ENV}.sqlite3`),
    },
    useNullAsDefault: true,
  });

  constructor() {
    super();
    User.knex(this.knex);
  }
}

export default KnexWrapper;
