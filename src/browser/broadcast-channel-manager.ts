import Logger from "../shared/logger";
import ServiceWorkerApplication from "./service-worker";
import WindowApplication from "./window";

class BroadcastChannelManager {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  app: WindowApplication | ServiceWorkerApplication;
  bc = new BroadcastChannel(BroadcastChannelManager.BROADCAST_CHANNEL_NAME);
  log = Logger.log.bind(this);

  constructor(app: WindowApplication | ServiceWorkerApplication) {
    this.app = app;
    this.bc.onmessage = (ev) => this.log(ev);
    this.bc.onmessageerror = (ev) => this.log(ev);
  }
}

export default BroadcastChannelManager;
