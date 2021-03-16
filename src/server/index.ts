import Path from "path";
import * as Zod from "zod";
import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import Knex from "knex";
import WebSocket from "ws";
import Config from "../shared/config";
import User from "./models/user";
import Connection from "./connection";

class ServerApplication {
  env = Zod.object({
    NODE_ENV: Zod.string(),
    PORT: Zod.string(),
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  config: Config;

  log: typeof Config.prototype.log;

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

  constructor(config: Config) {
    this.config = config;
    this.log = this.config.log.bind(this);
    User.knex(this.knex);

    this.express.use(ExpressPinoLogger({ logger: Config.pino }));
    this.express.use(Express.static(this.env.STATIC_PATH));

    this.webSocketServer.on("close", () => this.close());
    this.webSocketServer.on("connection", (x) => this.connection(x));
    this.webSocketServer.on("error", () => this.error());
    this.webSocketServer.on("headers", () => this.headers());
  }

  close(): void {
    this.log("close");
  }

  connection(socket: WebSocket): void {
    new Connection(this.config, socket);
  }

  error(): void {
    this.log("error", "error");
  }

  headers(): void {
    this.log("headers");
  }
}

Object.assign(globalThis, { app: new ServerApplication(new Config()) });

export default ServerApplication;
