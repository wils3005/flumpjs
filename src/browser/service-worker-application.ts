import Config from "../shared/config";

class ServiceWorkerApplication {
  config: Config;

  log: typeof Config.prototype.log;

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.log("constructor");
  }
}

export default ServiceWorkerApplication;
