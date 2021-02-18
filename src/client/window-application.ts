import ClientBase from "./client-base";
import DatabaseManager from "./database-manager";
import ServiceWorkerManager from "./service-worker-manager";
import VideoElementManager from "./video-element-manager";
import WebSocketManager from "./web-socket-manager";

class WindowApplication extends ClientBase {
  databaseManager = DatabaseManager.init();
  localVideoElement = new VideoElementManager();
  serviceWorkerManager = new ServiceWorkerManager();
  webSocketManager = new WebSocketManager();
}

export default WindowApplication;
