import * as UUID from "uuid";
import * as Zod from "zod";
import Message from "./message";
import Server from ".";
import WebSocket from "ws";

class Connection {
  static readonly all = new Map<string, Connection>();

  static get ids(): string[] {
    return Array.from(this.all.keys());
  }

  id = UUID.v4();
  app: Server;
  webSocket: WebSocket;

  constructor(app: Server, webSocket: WebSocket) {
    this.app = app;
    this.webSocket = webSocket;
    webSocket.onclose = () => this.close();
    webSocket.onerror = (x) => this.error(x);
    webSocket.onmessage = (x) => this.message(x);
    webSocket.onopen = () => this.open();

    this.send(
      new Message({ sender: "", recipient: this.id, ids: Connection.ids })
    );

    Connection.all.set(this.id, this);
  }

  close(): void {
    this.app.logger.info("close");
    Connection.all.delete(this.id);
  }

  error(event: WebSocket.ErrorEvent): void {
    this.app.logger.error("error");
    event.target.close();
    Connection.all.delete(this.id);
  }

  message(event: WebSocket.MessageEvent): void {
    const message = Message.parse(event.data);
    if (message.sender != this.id) {
      this.webSocket.emit("error");
      return;
    }

    Zod.instanceof(Connection)
      .parse(Connection.all.get(message.recipient))
      .send(message);
  }

  open(): void {
    this.app.logger.debug("open");
  }

  send(msg: Message): void {
    this.webSocket.send(msg.toString());
  }
}

export default Connection;
