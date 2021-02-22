import BroadcastChannelManager from "../broadcast-channel-manager";
import DatabaseManager from "../database-manager";
import Logger from "../../shared/logger";

class ServiceWorkerApplication {
  log = Logger.log.bind(this);
  bcManager: BroadcastChannelManager;
  databaseManager: DatabaseManager;

  constructor() {
    this.bcManager = new BroadcastChannelManager(this);
    this.databaseManager = new DatabaseManager();
  }
}

export default ServiceWorkerApplication;
