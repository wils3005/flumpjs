import "./app.css";
import "./favicon.ico";
import "./index.html";
import * as Zod from "zod";
import BroadcastChannelManager from "../broadcast-channel-manager";
import DatabaseManager from "../database-manager";
import Logger from "../../shared/logger";
import PeerConnectionManager from "./peer-connection-manager";
import ServiceWorkerManager from "./service-worker-manager";
import VideoElementManager from "./video-element-manager";
import WebSocketManager from "./web-socket-manager";

class WindowApplication {
  static PeerConnectionManager = PeerConnectionManager;

  log = Logger.log.bind(this);
  bcManager: BroadcastChannelManager = new BroadcastChannelManager(this);
  databaseManager = new DatabaseManager();

  localVideoElementManager = new VideoElementManager(this);
  serviceWorkerManager = new ServiceWorkerManager(this);
  webSocketManager = new WebSocketManager(this);

  private _id?: string;

  get id(): string {
    if (this._id) return this._id;

    return (this.id = Zod.string().parse(
      this.databaseManager.get("id").result
    ));
  }

  set id(id: string) {
    this.databaseManager.put("id", id);
    this._id = id;
  }
}

export default WindowApplication;
