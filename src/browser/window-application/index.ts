import "./app.css";
import "./favicon.ico";
import "./index.html";
import { Config } from "../../shared/config";
import { WebSocketManager } from "../web-socket-manager";
import { ServiceWorkerManager } from "./service-worker-manager";

class WindowApplication {
  config: Config;

  log: typeof Config.prototype.log;

  serviceWorkerManager: ServiceWorkerManager;

  webSocketManager: WebSocketManager;

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.serviceWorkerManager = new ServiceWorkerManager(config);
    this.webSocketManager = new WebSocketManager(config);
    this.log("constructor");
  }
}

export { WindowApplication };
