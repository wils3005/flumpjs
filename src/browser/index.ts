class Browser {
  constructor() {
    switch (globalThis.constructor.name) {
      case "ServiceWorkerGlobalScope":
        void import("./service-worker").then((x) => {
          Object.assign(globalThis, { app: new x.default() });
        });
        break;
      case "Window":
        void import("./window").then((x) => {
          Object.assign(globalThis, { app: new x.default() });
        });
        break;
      default:
        throw "oh no";
    }
  }
}

new Browser();

export default Browser;
