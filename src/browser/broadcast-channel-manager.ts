import Config from "./config";

class BroadcastChannelManager {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  config: Config;

  logger: typeof Config.prototype.logger;

  bc = new BroadcastChannel(BroadcastChannelManager.BROADCAST_CHANNEL_NAME);

  constructor(config: Config) {
    this.config = config;
    this.logger = config.logger.bind(this);
    this.bc.onmessage = (ev) => this.logger(ev);
    this.bc.onmessageerror = (ev) => this.logger(ev);
  }
}

export default BroadcastChannelManager;
