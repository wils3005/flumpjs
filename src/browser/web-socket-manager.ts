import { Config, Message } from "../shared";

class WebSocketManager {
  static readonly WS_URL = "ws://localhost:8080";

  config: Config;

  log: typeof Config.prototype.log;

  webSocket: WebSocket;

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.webSocket = this.create();
    this.log("constructor");
  }

  create(): WebSocket {
    this.log("create");
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

  message(event: MessageEvent<unknown>): void {
    this.log("message");

    try {
      const message = Message.parse(event.data);

      // DB
      // if (message.sender == "" && message.recipient)
      //   this.app.setID(message.recipient);

      // if (message.ids) {
      //   message.ids.forEach((id) => {
      //     if (id == this.app.getID()) return;

      //     void new PeerConnectionManager(id, this.app, this).makeCall();
      //   });
      // }

      // 3)
      if (message.offer) {
        // await new PeerConnectionManager(message.sender, this.app, this).answer(
        //   message.offer
        // );
      }

      // 5)
      // if (message.answer) {
      //   await Zod.instanceof(PeerConnectionManager)
      //     .parse(PeerConnectionManager.all.get(message.sender))
      //     .connection.setRemoteDescription(
      //       new RTCSessionDescription(message.answer)
      //     );
      // }

      // if (message.candidate) {
      //   this.log({ wat: message });
      //   await Zod.instanceof(PeerConnectionManager)
      //     .parse(PeerConnectionManager.all.get(message.sender))
      //     .connection.addIceCandidate(message.candidate);
      // }
    } catch (e) {
      this.log(e, "error");
    }
  }

  open(): void {
    this.log("open");
  }

  send(msg: Message): void {
    this.log("send");
    this.webSocket.send(msg.toString());
  }
}

export { WebSocketManager };
