import Config from "../shared/config";

class BroadcastChannelManager {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  config: Config;

  log: typeof Config.prototype.log;

  bc = new BroadcastChannel(BroadcastChannelManager.BROADCAST_CHANNEL_NAME);

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.bc.onmessage = (ev) => this.log(ev);
    this.bc.onmessageerror = (ev) => this.log(ev);
    this.log("constructor");
  }
}

export default BroadcastChannelManager;
