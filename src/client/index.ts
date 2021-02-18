import "./app.css";
import "./favicon.ico";
import "./index.html";
import ServiceWorkerApplication from "./service-worker-application";
import WindowApplication from "./window-application";

let app;

switch (globalThis.constructor.name) {
  case "ServiceWorkerGlobalScope":
    app = new ServiceWorkerApplication();
    break;
  case "Window":
    app = new WindowApplication();
    break;
  default:
    throw "oh no";
}

Object.assign(globalThis, { app });

export {};
