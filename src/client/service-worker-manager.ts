import * as Zod from "zod";
import ClientBase from "./client-base";
import LogLevel from "../log-level";

class ServiceWorkerManager extends ClientBase {
  static readonly SW_URL = "app.js";

  private _container?: ServiceWorkerContainer;
  private _registration?: ServiceWorkerRegistration;
  private _worker?: ServiceWorker;

  constructor() {
    super();
    this.container = globalThis.navigator.serviceWorker;
  }

  get container(): ServiceWorkerContainer {
    return Zod.instanceof(ServiceWorkerContainer).parse(this._container);
  }

  set container(container: ServiceWorkerContainer) {
    container.oncontrollerchange = () => this.log("controllerChange");
    container.onmessage = () => this.log("message");
    container.onmessageerror = () => this.log("messageError", LogLevel.ERROR);

    void container
      .register(ServiceWorkerManager.SW_URL)
      .then((registration) => (this.registration = registration))
      .catch((r) => this.log(r, LogLevel.ERROR));

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
    this.log("error", LogLevel.ERROR);
  }
}

export default ServiceWorkerManager;
