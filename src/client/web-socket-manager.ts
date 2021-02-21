import Logger from "../shared/logger";
import Message from "../shared/message";
import PeerConnectionManager from "./peer-connection-manager";
import WindowApplication from "./window-application";

class WebSocketManager {
  static readonly WS_URL = "ws://localhost:8080";

  messages = new Set<Message>();
  app: WindowApplication;
  log = Logger.log.bind(this);
  webSocket: WebSocket;

  constructor(app: WindowApplication) {
    this.app = app;
    this.webSocket = this.create();
  }

  close(): void {
    this.log("close");
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

  error(): void {
    this.log("error", "error");
    this.webSocket.close();
  }

  async message(event: MessageEvent<unknown>): Promise<void> {
    this.log("message");
    const message = Message.parse(event.data);
    let pcm;

    if (message.id) this.app.id = message.id;

    if (message.ids) {
      message.ids.forEach((id) => {
        if (id == this.app.id) return;

        const pcm = new PeerConnectionManager(this.app);
        void pcm.makeCall(id);
        this.app.peerConnectionManagers.add(pcm);
      });
    }

    if (message.offer && message.id) {
      pcm = new PeerConnectionManager(this.app);
      await pcm.answer(message.offer);
      this.app.peerConnectionManagers.add(pcm);
    }

    if (message.answer) {
      pcm = new PeerConnectionManager(this.app);
      await pcm.answer(message.answer);
      this.app.peerConnectionManagers.add(pcm);
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

export default WebSocketManager;
