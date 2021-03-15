import * as Zod from "zod";
import BroadcastChannelManager from "./broadcast-channel-manager";
import DatabaseManager from "./database-manager";
import Pino from "pino";

type LogLevel = Zod.infer<typeof BrowserApplication.LogLevel>;

class BrowserApplication {
  static LogLevel = Zod.enum(["trace", "debug", "info", "warn", "error"]);

  static pino = Pino({
    level: "debug",
  });

  bcManager: BroadcastChannelManager = new BroadcastChannelManager(this);
  databaseManager = new DatabaseManager(this);

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

  constructor() {
    switch (globalThis.constructor.name) {
      case "ServiceWorkerGlobalScope":
        void import("./service-worker").then((x) => {
          Object.assign(globalThis, { app: new x.default(this) });
        });
        break;
      case "Window":
        void import("./window").then((x) => {
          Object.assign(globalThis, { app: new x.default(this) });
        });
        break;
      default:
        throw "oh no";
    }
  }

  logger(msg: unknown, level: LogLevel = "debug"): void {
    BrowserApplication.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }
}

new BrowserApplication();

export default BrowserApplication;
