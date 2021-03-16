import * as Zod from "zod";
import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import Knex from "knex";
import Path from "path";
import Pino from "pino";
import REPL from "repl";
import WebSocket from "ws";
import User from "./models/user";
import Connection from "./connection";

class Server {
  env = Zod.object({
    NODE_ENV: Zod.string(),
    PORT: Zod.string(),
    REPL: Zod.string().optional(),
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  logger = Pino({
    level: "debug",
  });

  knex = Knex({
    client: "sqlite3",
    connection: {
      filename: Path.join(process.cwd(), `${this.env.NODE_ENV}.sqlite3`),
    },
    useNullAsDefault: true,
  });

  express: Express.Express = Express();

  httpServer = this.express.listen(this.env.PORT);

  webSocketServer = new WebSocket.Server({ server: this.httpServer });

  constructor() {
    User.knex(this.knex);

    this.express.use(ExpressPinoLogger({ logger: this.logger }));
    this.express.use(Express.static(this.env.STATIC_PATH));

    this.webSocketServer.on("close", () => this.logger.info("close"));
    this.webSocketServer.on("connection", (x) => new Connection(this, x));
    this.webSocketServer.on("error", () => this.logger.error("error"));
    this.webSocketServer.on("headers", () => this.logger.info("headers"));

    if (this.env.REPL) {
      Object.assign(REPL.start("repl> ").context, { app: this });
    }
  }
}

new Server();

export default Server;
