import "./app.css";
import "./favicon.ico";
import "./index.html";
import BrowserApplication from "..";
import EmojiMatch from "./emoji-match";
import ServiceWorkerManager from "./service-worker-manager";
import WebSocketManager from "./web-socket-manager";

class WindowApplication {
  app: BrowserApplication;
  serviceWorkerManager: ServiceWorkerManager;
  emojiMatch: EmojiMatch;
  webSocketManager: WebSocketManager;

  constructor(app: BrowserApplication) {
    this.app = app;
    this.serviceWorkerManager = new ServiceWorkerManager(app);
    this.webSocketManager = new WebSocketManager(app);
    this.emojiMatch = new EmojiMatch(app);
  }
}

export default WindowApplication;
