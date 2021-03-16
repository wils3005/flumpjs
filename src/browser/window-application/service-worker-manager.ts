import * as Zod from "zod";
import Config from "../config";

class ServiceWorkerManager {
  static readonly SW_URL = "app.js";

  config: Config;

  logger: typeof Config.prototype.logger;

  private _container?: ServiceWorkerContainer;

  private _registration?: ServiceWorkerRegistration;

  private _worker?: ServiceWorker;

  constructor(config: Config) {
    this.config = config;
    this.logger = config.logger.bind(this);
    this.container = globalThis.navigator.serviceWorker;
    this.logger("constructor");
  }

  get container(): ServiceWorkerContainer {
    return Zod.instanceof(ServiceWorkerContainer).parse(this._container);
  }

  set container(container: ServiceWorkerContainer) {
    container.oncontrollerchange = () => this.logger("controllerChange");
    container.onmessage = () => this.logger("message");
    container.onmessageerror = () => this.logger("messageError", "error");

    void container
      .register(ServiceWorkerManager.SW_URL)
      .then((registration) => (this.registration = registration))
      .catch((r) => this.logger(r, "error"));

    this._container = container;
  }

  get registration(): ServiceWorkerRegistration {
    return Zod.instanceof(ServiceWorkerRegistration).parse(this._registration);
  }

  set registration(registration: ServiceWorkerRegistration) {
    if (registration) {
      registration.onupdatefound = () => this.logger("upgradeFound");
      registration.update().catch(() => this.error());
      const serviceWorker =
        registration.installing ?? registration.waiting ?? registration.active;

      if (serviceWorker) this.worker = serviceWorker;
    }

    this._registration = registration;
  }

  get worker(): ServiceWorker {
    return Zod.instanceof(ServiceWorker).parse(this._worker);
  }

  set worker(worker: ServiceWorker) {
    if (worker) {
      worker.onstatechange = () => this.logger("stateChange");
      worker.onerror = () => this.error();
    }

    this._worker = worker;
  }

  error(): void {
    this.logger("error", "error");
  }
}

export default ServiceWorkerManager;
