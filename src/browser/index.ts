// import * as Zod from "zod";
import Config from "../shared/config";
import BroadcastChannelManager from "./broadcast-channel-manager";
import DatabaseManager from "./database-manager";
import ServiceWorkerApplication from "./service-worker-application";
import WindowApplication from "./window-application";

class BrowserApplication {
  log: typeof Config.prototype.log;

  bcManager: BroadcastChannelManager;

  databaseManager: DatabaseManager;

  window?: WindowApplication;

  serviceWorker?: ServiceWorkerApplication;

  constructor(config: Config) {
    this.log = config.log.bind(this);
    this.bcManager = new BroadcastChannelManager(config);
    this.databaseManager = new DatabaseManager(config);

    switch (Config.globalName) {
      case "ServiceWorkerGlobalScope":
        import("./service-worker-application")
          .then((x) => (this.serviceWorker = new x.default(config)))
          .catch((x) => this.log(x));

        break;
      case "Window":
        import("./window-application")
          .then((x) => (this.window = new x.default(config)))
          .catch((x) => this.log(x));

        break;
      default:
        throw new Error("oh no");
    }

    this.log("constructor");
  }
}

Object.assign(globalThis, { app: new BrowserApplication(new Config()) });

export default BrowserApplication;
