import * as Objection from "objection";

class User extends Objection.Model {
  static tableName = "users";

  id = 0;

  username = "";

  password = "";
}

export { User };
