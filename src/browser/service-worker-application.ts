import Config from "./config";

class ServiceWorkerApplication {
  config: Config;

  logger: typeof Config.prototype.logger;

  constructor(config: Config) {
    this.config = config;
    this.logger = config.logger.bind(this);
    this.logger("constructor");
  }
}

export default ServiceWorkerApplication;
