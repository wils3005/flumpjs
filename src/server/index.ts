import * as Zod from "zod";
import Connection from "./connection";
import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import HTTP from "http";
import KnexWrapper from "./knex-wrapper";
import Logger from "../shared/logger";
import REPL from "repl";
import WebSocket from "ws";

class Server {
  env = Zod.object({
    PORT: Zod.string(),
    REPL: Zod.string().optional(),
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  knex = new KnexWrapper().knex;
  express: Express.Express = Express();
  httpServer: HTTP.Server;
  log = Logger.log.bind(this);
  webSocketServer: WebSocket.Server;

  constructor() {
    this.express.use(ExpressPinoLogger({ logger: Logger.pino }));
    this.express.use(Express.static(this.env.STATIC_PATH));
    this.express.on("mount", () => this.log("mount"));

    this.httpServer = this.express.listen(this.env.PORT);
    this.httpServer.on("close", () => this.log("close", "warn"));
    this.httpServer.on("connection", () => this.log("connection"));
    this.httpServer.on("error", () => this.log("error", "error"));
    this.httpServer.on("listening", () => this.log("listening"));
    this.httpServer.on("request", () => this.log("request"));
    this.httpServer.on("upgrade", () => this.log("upgrade"));

    this.webSocketServer = new WebSocket.Server({ server: this.httpServer });
    this.webSocketServer.on("close", () => this.log("close", "warn"));
    this.webSocketServer.on("connection", (x) => new Connection(x));
    this.webSocketServer.on("error", () => this.log("error", "error"));
    this.webSocketServer.on("headers", () => this.log("headers"));

    if (this.env.REPL) {
      Object.assign(REPL.start("repl> ").context, { app: this });
    }
  }
}

export default Server;
