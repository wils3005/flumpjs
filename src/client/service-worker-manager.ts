import * as Zod from "zod";
import Logger from "../shared/logger";
import WindowApplication from "./window-application";

class ServiceWorkerManager {
  static readonly SW_URL = "app.js";

  app: WindowApplication;
  log = Logger.log.bind(this);

  private _container?: ServiceWorkerContainer;
  private _registration?: ServiceWorkerRegistration;
  private _worker?: ServiceWorker;

  constructor(app: WindowApplication) {
    this.app = app;
    this.container = globalThis.navigator.serviceWorker;
  }

  get container(): ServiceWorkerContainer {
    return Zod.instanceof(ServiceWorkerContainer).parse(this._container);
  }

  set container(container: ServiceWorkerContainer) {
    container.oncontrollerchange = () => this.log("controllerChange");
    container.onmessage = () => this.log("message");
    container.onmessageerror = () => this.log("messageError", "error");

    void container
      .register(ServiceWorkerManager.SW_URL)
      .then((registration) => (this.registration = registration))
      .catch((r) => this.log(r, "error"));

    this._container = container;
  }

  get registration(): ServiceWorkerRegistration {
    return Zod.instanceof(ServiceWorkerRegistration).parse(this._registration);
  }

  set registration(registration: ServiceWorkerRegistration) {
    if (registration) {
      registration.onupdatefound = () => this.log("upgradeFound");
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
      worker.onstatechange = () => this.log("stateChange");
      worker.onerror = () => this.error();
    }

    this._worker = worker;
  }

  error(): void {
    this.log("error", "error");
  }
}

export default ServiceWorkerManager;
