// import * as Zod from "zod";
import BroadcastChannelManager from "./broadcast-channel-manager";
import Config from "./config";
import DatabaseManager from "./database-manager";
import ServiceWorkerApplication from "./service-worker-application";
import WindowApplication from "./window-application";

class BrowserApplication {
  config = new Config();

  logger = this.config.logger.bind(this);

  bcManager: BroadcastChannelManager = new BroadcastChannelManager(this.config);

  databaseManager = new DatabaseManager(this.config);

  id?: string;

  window?: WindowApplication;

  serviceWorker?: ServiceWorkerApplication;

  constructor() {
    switch (globalThis.constructor.name) {
      case "ServiceWorkerGlobalScope":
        import("./service-worker-application")
          .then((x) => (this.serviceWorker = new x.default(this)))
          .catch((x) => this.logger(x));

        break;
      case "Window":
        import("./window-application")
          .then((x) => (this.window = new x.default(this)))
          .catch((x) => this.logger(x));

        break;
      default:
        throw new Error("oh no");
    }

    this.logger("constructor");
  }

  // getID(): string {
  //   if (this.id) return this.id;

  //   return Zod.string().parse(this.databaseManager.get("id").result);
  // }

  // setID(id: string): void {
  //   this.databaseManager.put("id", id);
  //   this.id = id;
  // }
}

Object.assign(globalThis, { app: new BrowserApplication() });

export default BrowserApplication;
