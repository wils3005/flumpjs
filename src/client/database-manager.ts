import * as Zod from "zod";
import Logger from "../shared/logger";
import WindowApplication from "./window-application";

class DatabaseManager {
  static NAME = "db1";
  static STORE = "object-store-1";

  app: WindowApplication;
  log = Logger.log.bind(this);
  request: IDBOpenDBRequest;
  _db?: IDBDatabase;

  constructor(app: WindowApplication) {
    this.app = app;
    this.request = globalThis.indexedDB.open(DatabaseManager.NAME);
    this.request.onblocked = (x) => this.log(x, "warn");
    this.request.onerror = (x) => this.log(x, "error");
    this.request.onsuccess = (x) => this.success(x);
    this.request.onupgradeneeded = (x) => this.upgradeNeeded(x);
  }

  get db(): IDBDatabase {
    return Zod.instanceof(IDBDatabase).parse(this._db);
  }

  set db(db: IDBDatabase) {
    db.onabort = (ev) => this.log(ev, "warn");
    db.onclose = (ev) => this.log(ev);
    db.onerror = (ev) => this.log(ev, "error");
    db.onversionchange = (ev) => this.log(ev);
    this._db = db;
  }

  get(query: string): IDBRequest {
    return this.objectStore("readonly").get(query);
  }

  put(key: string, value: unknown): void {
    this.objectStore("readwrite").put(value, key);
  }

  objectStore(
    mode: "readonly" | "readwrite" | "versionchange"
  ): IDBObjectStore {
    return this.transaction(mode).objectStore(DatabaseManager.STORE);
  }

  success(event: Event): void {
    this.db = Zod.instanceof(IDBOpenDBRequest).parse(event.target).result;
  }

  transaction(
    mode: "readonly" | "readwrite" | "versionchange"
  ): IDBTransaction {
    return this.db.transaction(DatabaseManager.STORE, mode);
  }

  upgradeNeeded(event: IDBVersionChangeEvent): void {
    const req = Zod.instanceof(IDBRequest).parse(event.target);
    const db = Zod.instanceof(IDBDatabase).parse(req.result);

    db.createObjectStore(DatabaseManager.STORE, {
      autoIncrement: true,
    });
  }
}

export default DatabaseManager;
