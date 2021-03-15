import BrowserApplication from "..";

class ServiceWorkerApplication {
  app: BrowserApplication;

  constructor(app: BrowserApplication) {
    this.app = app;
  }
}

export default ServiceWorkerApplication;
