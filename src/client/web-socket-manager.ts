import * as Zod from "zod";
import ClientBase from "./client-base";
import LogLevel from "../log-level";
import Message from "./message";

class WebSocketManager extends ClientBase {
  static readonly WS_URL = "ws://localhost:8080";

  readonly messages = Array<Message>();

  private _webSocket?: WebSocket;

  constructor() {
    super();
    this.webSocket = new WebSocket(WebSocketManager.WS_URL);
  }

  get webSocket(): WebSocket {
    return Zod.instanceof(WebSocket).parse(this._webSocket);
  }

  set webSocket(socket: WebSocket) {
    socket.onclose = () => this.close();
    socket.onerror = (x) => this.error(x);
    socket.onmessage = (x) => this.message(x);
    socket.onopen = () => this.open();
    this._webSocket = socket;
  }

  close(): void {
    if (this.webSocket) this.webSocket.close();
  }

  error(event: Event): void {
    this.log(event, LogLevel.ERROR);
    if (this.webSocket) this.webSocket.close();
  }

  message(event: MessageEvent<unknown>): void {
    this.messages.push(new Message(event.data));
  }

  open(): void {
    this.log("open");
  }

  send(data: unknown): void {
    if (this.webSocket) this.webSocket.send(JSON.stringify(data));
  }
}

export default WebSocketManager;
