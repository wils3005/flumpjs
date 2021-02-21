import Logger from "../shared/logger";

abstract class BroadcastChannelManager {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  // loggerOptions: Pino.LoggerOptions = {
  //   browser: { asObject: true },
  //   level: "debug",
  // };

  bc = new BroadcastChannel(BroadcastChannelManager.BROADCAST_CHANNEL_NAME);
  log = Logger.log.bind(this);

  constructor() {
    this.bc.onmessage = (ev) => this.log(ev);
    this.bc.onmessageerror = (ev) => this.log(ev);
  }
}

export default BroadcastChannelManager;
