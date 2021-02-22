import * as Zod from "zod";
import Logger from "../shared/logger";

class DatabaseManager {
  static NAME = "db1";
  static STORE = "object-store-1";

  log = Logger.log.bind(this);
  request: IDBOpenDBRequest;
  private db?: IDBDatabase;

  constructor() {
    this.request = globalThis.indexedDB.open(DatabaseManager.NAME);
    this.request.onblocked = (x) => this.log(x, "warn");
    this.request.onerror = (x) => this.log(x, "error");
    this.request.onsuccess = (x) => this.success(x);
    this.request.onupgradeneeded = (x) => this.upgradeNeeded(x);
  }

  get(query: string): IDBRequest {
    return this.objectStore("readonly").get(query);
  }

  put(key: string, value: unknown): void {
    this.objectStore("readwrite").put(value, key);
  }

  //////////////////////////////////////////////////////////////////////////////

  private objectStore(
    mode: "readonly" | "readwrite" | "versionchange"
  ): IDBObjectStore {
    return Zod.instanceof(IDBDatabase)
      .parse(this.db)
      .transaction(DatabaseManager.STORE, mode)
      .objectStore(DatabaseManager.STORE);
  }

  private success(event: Event): void {
    const db = Zod.instanceof(IDBOpenDBRequest).parse(event.target).result;
    db.onabort = (ev) => this.log(ev, "warn");
    db.onclose = (ev) => this.log(ev);
    db.onerror = (ev) => this.log(ev, "error");
    db.onversionchange = (ev) => this.log(ev);
    this.db = db;
  }

  private upgradeNeeded(event: IDBVersionChangeEvent): void {
    Zod.instanceof(IDBDatabase)
      .parse(Zod.instanceof(IDBRequest).parse(event.target).result)
      .createObjectStore(DatabaseManager.STORE, {
        autoIncrement: true,
      });
  }
}

export default DatabaseManager;
