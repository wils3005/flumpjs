import { Config } from "../../shared/config";

class ServiceWorkerManager {
  static readonly SW_URL = "app.js";

  config: Config;

  log: typeof Config.prototype.log;

  private container?: ServiceWorkerContainer;

  private registration?: ServiceWorkerRegistration;

  private worker?: ServiceWorker;

  constructor(config: Config) {
    this.config = config;
    this.log = config.log.bind(this);
    this.setContainer(globalThis.navigator.serviceWorker);
    this.log("constructor");
  }

  setContainer(container: ServiceWorkerContainer): void {
    this.log("setContainer");
    container.oncontrollerchange = () => this.log("controllerChange");
    container.onmessage = () => this.log("message");
    container.onmessageerror = () => this.log("messageError", "error");

    void container
      .register(ServiceWorkerManager.SW_URL)
      .then((registration) => this.setRegistration(registration))
      .catch((r) => this.log(r, "error"));

    this.container = container;
  }

  setRegistration(registration: ServiceWorkerRegistration): void {
    this.log("setRegistration");
    registration.onupdatefound = () => this.log("upgradeFound");
    registration.update().catch(() => this.error());

    const serviceWorker =
      registration.installing ?? registration.waiting ?? registration.active;

    if (serviceWorker) this.setWorker(serviceWorker);

    this.registration = registration;
  }

  setWorker(worker: ServiceWorker): void {
    this.log("setWorker");
    if (worker) {
      worker.onstatechange = () => this.log("stateChange");
      worker.onerror = () => this.error();
    }

    this.worker = worker;
  }

  error(): void {
    this.log("error", "error");
  }
}

export { ServiceWorkerManager };
