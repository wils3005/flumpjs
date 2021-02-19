import * as UUID from "uuid";
import * as Zod from "zod";
import Base from "./base";
import LogLevel from "./log-level";
import WebSocket from "ws";

class Session extends Base {
  static readonly all = new Set<Session>();

  static ids(): string {
    return JSON.stringify({
      ids: Array.from(this.all).map((s) => s.id),
    });
  }

  readonly webSocket: WebSocket;
  readonly id = UUID.v4();

  constructor(webSocket: WebSocket) {
    super();
    this.log("constructor");
    webSocket.onclose = () => this.close();
    webSocket.onerror = (ev) => this.error(ev);
    webSocket.onmessage = (ev) => this.message(ev);
    webSocket.onopen = () => this.open();
    webSocket.send(Session.ids());
    this.webSocket = webSocket;
    Session.all.add(this);
  }

  close(): void {
    this.log("close");
    Session.all.delete(this);
  }

  error(event: WebSocket.ErrorEvent): void {
    this.log("error", LogLevel.ERROR);
    event.target.close();
    Session.all.delete(this);
  }

  message(event: WebSocket.MessageEvent): void {
    this.log("message");
    const { data, target } = event;

    try {
      Session.all.forEach((session) => {
        if (session.webSocket == target) return;

        session.webSocket.send(
          JSON.stringify(
            Zod.record(Zod.unknown()).parse(JSON.parse(String(data)))
          )
        );
      });
    } catch (e) {
      this.log(e, LogLevel.ERROR);
    }
  }

  open(): void {
    this.log("open");
  }
}

export default Session;
