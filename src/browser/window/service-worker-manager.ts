import * as Zod from "zod";
import BrowserApplication from "..";

class ServiceWorkerManager {
  static readonly SW_URL = "app.js";

  app: BrowserApplication;

  private _container?: ServiceWorkerContainer;
  private _registration?: ServiceWorkerRegistration;
  private _worker?: ServiceWorker;

  constructor(app: BrowserApplication) {
    this.app = app;
    this.container = globalThis.navigator.serviceWorker;
  }

  get container(): ServiceWorkerContainer {
    return Zod.instanceof(ServiceWorkerContainer).parse(this._container);
  }

  set container(container: ServiceWorkerContainer) {
    container.oncontrollerchange = () => this.app.logger("controllerChange");
    container.onmessage = () => this.app.logger("message");
    container.onmessageerror = () => this.app.logger("messageError", "error");

    void container
      .register(ServiceWorkerManager.SW_URL)
      .then((registration) => (this.registration = registration))
      .catch((r) => this.app.logger(r, "error"));

    this._container = container;
  }

  get registration(): ServiceWorkerRegistration {
    return Zod.instanceof(ServiceWorkerRegistration).parse(this._registration);
  }

  set registration(registration: ServiceWorkerRegistration) {
    if (registration) {
      registration.onupdatefound = () => this.app.logger("upgradeFound");
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
      worker.onstatechange = () => this.app.logger("stateChange");
      worker.onerror = () => this.error();
    }

    this._worker = worker;
  }

  error(): void {
    this.app.logger("error", "error");
  }
}

export default ServiceWorkerManager;
