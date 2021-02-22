import * as Zod from "zod";
import Logger from "../../shared/logger";
import Message from "./message";
import PeerConnectionManager from "./peer-connection-manager";
import WindowApplication from ".";

class WebSocketManager {
  static readonly WS_URL = "ws://localhost:8080";

  app: WindowApplication;
  log = Logger.log.bind(this);
  webSocket: WebSocket;

  constructor(app: WindowApplication) {
    this.app = app;
    this.webSocket = this.create();
  }

  create(): WebSocket {
    const webSocket = new WebSocket(WebSocketManager.WS_URL);
    webSocket.onclose = () => this.close();
    webSocket.onerror = () => this.error();
    webSocket.onmessage = (x) => this.message(x);
    webSocket.onopen = () => this.open();
    return webSocket;
  }

  close(): void {
    this.log("close");
  }

  error(): void {
    this.log("error", "error");
    this.webSocket.close();
  }

  async message(event: MessageEvent<unknown>): Promise<void> {
    try {
      const message = Message.parse(event.data);

      // DB
      if (message.sender == "" && message.recipient)
        this.app.id = message.recipient;

      if (message.ids) {
        message.ids.forEach((id) => {
          if (id == this.app.id) return;

          void new PeerConnectionManager(id, this.app, this).makeCall();
        });
      }

      // 3)
      if (message.offer) {
        await new PeerConnectionManager(message.sender, this.app, this).answer(
          message.offer
        );
      }

      // 5)
      if (message.answer) {
        await Zod.instanceof(PeerConnectionManager)
          .parse(PeerConnectionManager.all.get(message.sender))
          .connection.setRemoteDescription(
            new RTCSessionDescription(message.answer)
          );
      }

      if (message.candidate) {
        this.log({ wat: message });
        await Zod.instanceof(PeerConnectionManager)
          .parse(PeerConnectionManager.all.get(message.sender))
          .connection.addIceCandidate(message.candidate);
      }
    } catch (e) {
      this.log(e, "error");
    }
  }

  open(): void {
    this.log("open");
  }

  send(msg: Message): void {
    this.webSocket.send(msg.toString());
  }
}

export default WebSocketManager;
