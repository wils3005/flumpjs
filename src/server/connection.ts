import * as UUID from "uuid";
import * as Zod from "zod";
import Logger from "../shared/logger";
import Message from "./message";
import WebSocket from "ws";

class Connection {
  static readonly all = new Map<string, Connection>();

  static get ids(): string[] {
    return Array.from(this.all.keys());
  }

  log = Logger.log.bind(this);
  id = UUID.v4();
  webSocket: WebSocket;

  constructor(webSocket: WebSocket) {
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
    this.log("close");
    Connection.all.delete(this.id);
  }

  error(event: WebSocket.ErrorEvent): void {
    this.log("error", "error");
    event.target.close();
    Connection.all.delete(this.id);
  }

  message(event: WebSocket.MessageEvent): void {
    const message = Message.parse(event.data);

    this.log(
      `receiving from ${message.sender}; sending to ${message.recipient}`
    );

    Zod.instanceof(Connection)
      .parse(Connection.all.get(message.recipient))
      .send(message);
  }

  open(): void {
    this.log("open");
  }

  send(msg: Message): void {
    this.webSocket.send(msg.toString());
  }
}

export default Connection;
