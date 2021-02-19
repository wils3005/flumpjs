import * as Zod from "zod";
import Express from "express";
import ExpressPinoLogger from "express-pino-logger";
import HTTP from "http";
import KnexWrapper from "./knex-wrapper";
import LogLevel from "./log-level";
import Pino from "pino";
import REPL from "repl";
import Session from "./session";
import WebSocket from "ws";

class Application {
  env = Zod.object({
    PORT: Zod.string(),
    REPL: Zod.string().optional(),
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  readonly loggerOptions: Pino.LoggerOptions = {
    level: "debug",
  };

  readonly pino = Pino(this.loggerOptions);
  knex = new KnexWrapper().knex;
  express: Express.Express = Express();
  httpServer: HTTP.Server;
  webSocketServer: WebSocket.Server;

  constructor() {
    this.express.use(ExpressPinoLogger({ logger: this.pino }));
    this.express.use(Express.static(this.env.STATIC_PATH));
    this.express.on("mount", () => this.mount());

    this.httpServer = this.express.listen(this.env.PORT);
    this.httpServer.on("close", () => this.log("close"));
    this.httpServer.on("connection", () => this.log("connection"));
    this.httpServer.on("error", () => this.log("error", LogLevel.ERROR));
    this.httpServer.on("listening", () => this.log("listening"));
    this.httpServer.on("request", () => this.log("request"));
    this.httpServer.on("upgrade", () => this.log("upgrade"));

    this.webSocketServer = new WebSocket.Server({ server: this.httpServer });
    this.webSocketServer.on("close", () => this.close());
    this.webSocketServer.on("connection", (x) => this.connection(x));
    this.webSocketServer.on("error", () => this.error());
    this.webSocketServer.on("headers", () => this.headers());

    if (this.env.REPL) {
      Object.assign(REPL.start("repl> ").context, { app: this });
    }
  }

  close(): void {
    this.log("close", LogLevel.WARN);
  }

  connection(socket: WebSocket): void {
    new Session(socket);
  }

  error(): void {
    this.log("error", LogLevel.ERROR);
  }

  headers(): void {
    this.log("headers");
  }

  log(msg: unknown, level = LogLevel.DEBUG): void {
    this.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }

  mount(): void {
    this.log("mount");
  }
}

new Application();

export default Application;
