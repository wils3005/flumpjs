import "./app.css";
import "./favicon.ico";
import "./index.html";
import Config from "../config";
import EmojiMatch from "./emoji-match";
import ServiceWorkerManager from "./service-worker-manager";
import WebSocketManager from "./web-socket-manager";

class WindowApplication {
  config: Config;

  logger: typeof Config.prototype.logger;

  serviceWorkerManager: ServiceWorkerManager;

  emojiMatch: EmojiMatch;

  webSocketManager: WebSocketManager;

  constructor(config: Config) {
    this.config = config;
    this.logger = config.logger.bind(this);
    this.serviceWorkerManager = new ServiceWorkerManager(config);
    this.webSocketManager = new WebSocketManager(config);
    this.emojiMatch = new EmojiMatch(config);
    this.logger("constructor");
  }
}

export default WindowApplication;
