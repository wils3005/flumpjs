import Base from "./base";
import HTTPServerWrapper from "./http-server-wrapper";
import LogLevel from "./log-level";
import Session from "./session";
import WebSocket from "ws";

class WebSocketServerWrapper extends Base {
  readonly httpServer = new HTTPServerWrapper().server;
  readonly webSocketServer = new WebSocket.Server({ server: this.httpServer });

  constructor() {
    super();
    this.webSocketServer.on("close", () => this.close());
    this.webSocketServer.on("connection", (x) => this.connection(x));
    this.webSocketServer.on("error", () => this.error());
    this.webSocketServer.on("headers", () => this.headers());
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
}

export default WebSocketServerWrapper;
