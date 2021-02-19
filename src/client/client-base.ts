import Base from "../wrappers/wrapper";
import Pino from "pino";

abstract class ClientBase extends Base {
  static BROADCAST_CHANNEL_NAME = "broadcast-channel-1";

  bc = new BroadcastChannel(ClientBase.BROADCAST_CHANNEL_NAME);

  readonly loggerOptions: Pino.LoggerOptions = {
    browser: { asObject: true },
    level: "debug",
  };

  constructor() {
    super();
    this.bc.onmessage = (ev) => this.log(ev);
    this.bc.onmessageerror = (ev) => this.log(ev);
  }
}

export default ClientBase;
