import * as Zod from "zod";
import KnexWrapper from "./knex-wrapper";
import Pino from "pino";
import REPL from "repl";
import WebSocketServerWrapper from "./web-socket-server-wrapper";

class Application {
  readonly env = Zod.object({
    NODE_ENV: Zod.string(),
    PORT: Zod.string(),
    SHELL: Zod.string().optional(),
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  readonly knex = new KnexWrapper().knex;
  readonly logger = Pino({ level: "debug", name: this.constructor.name });
  readonly replServer = REPL.start("repl> ");
  readonly webSocketServer = new WebSocketServerWrapper();

  constructor() {
    this.logger.debug("constructor");
    Object.assign(this.replServer.context, { app: this });
  }
}

new Application();

export default Application;
