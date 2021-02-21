import * as UUID from "uuid";
import * as Zod from "zod";
import Logger from "../shared/logger";
import Message from "../shared/message";
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

    Connection.all.set(this.id, this);
    this.send(new Message({ id: this.id }));

    Connection.all.forEach((x) => {
      x.webSocket.send(new Message({ ids: Connection.ids }).toString());
    });
  }

  // (event: WebSocket.CloseEvent)
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
    this.log("message");
    const message = Message.parse(event.data);

    if (message.id) {
      Zod.instanceof(Connection)
        .parse(Connection.all.get(message.id))
        .send(message);
    }
  }

  // (event: WebSocket.OpenEvent)
  open(): void {
    this.log("open");
  }

  send(msg: Message): void {
    this.webSocket.send(msg.toString());
  }
}

export default Connection;
