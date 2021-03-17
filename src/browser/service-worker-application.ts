import { Config } from "../shared";

class ServiceWorkerApplication {
  config: Config;

  log: typeof Config.prototype.log;

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.log("constructor");
  }
}

export { ServiceWorkerApplication };
