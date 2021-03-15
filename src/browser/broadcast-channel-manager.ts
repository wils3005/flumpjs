import BrowserApplication from ".";

class BroadcastChannelManager {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  app: BrowserApplication;
  bc = new BroadcastChannel(BroadcastChannelManager.BROADCAST_CHANNEL_NAME);

  constructor(app: BrowserApplication) {
    this.app = app;
    this.bc.onmessage = (ev) => this.app.logger(ev);
    this.bc.onmessageerror = (ev) => this.app.logger(ev);
  }
}

export default BroadcastChannelManager;
