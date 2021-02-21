import * as Zod from "zod";
import DatabaseManager from "./database-manager";
import PeerConnectionManager from "./peer-connection-manager";
import ServiceWorkerManager from "./service-worker-manager";
import VideoElementManager from "./video-element-manager";
import WebSocketManager from "./web-socket-manager";

class WindowApplication {
  databaseManager = new DatabaseManager(this);
  localVideoElementManager = new VideoElementManager(this);
  serviceWorkerManager = new ServiceWorkerManager(this);
  webSocketManager = new WebSocketManager(this);
  peerConnectionManagers = new Set<PeerConnectionManager>();

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
