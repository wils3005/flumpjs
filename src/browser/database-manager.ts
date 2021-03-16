import * as Zod from "zod";
import Config from "./config";

class DatabaseManager {
  static NAME = "db1";

  static STORE = "object-store-1";

  config: Config;

  logger: typeof Config.prototype.logger;

  request: IDBOpenDBRequest;

  private db?: IDBDatabase;

  constructor(config: Config) {
    this.config = config;
    this.logger = this.config.logger.bind(this);
    this.request = globalThis.indexedDB.open(DatabaseManager.NAME);
    this.request.onblocked = (x) => this.logger(x, "warn");
    this.request.onerror = (x) => this.logger(x, "error");
    this.request.onsuccess = (x) => this.success(x);
    this.request.onupgradeneeded = (x) => this.upgradeNeeded(x);
  }

  get(query: string): IDBRequest {
    return this.objectStore("readonly").get(query);
  }

  put(key: string, value: unknown): void {
    this.objectStore("readwrite").put(value, key);
  }

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
    db.onabort = (ev) => this.logger(ev, "warn");
    db.onclose = (ev) => this.logger(ev);
    db.onerror = (ev) => this.logger(ev, "error");
    db.onversionchange = (ev) => this.logger(ev);
    this.db = db;
  }

  private upgradeNeeded(event: IDBVersionChangeEvent): void {
    this.logger("upgradeNeeded");

    Zod.instanceof(IDBDatabase)
      .parse(Zod.instanceof(IDBRequest).parse(event.target).result)
      .createObjectStore(DatabaseManager.STORE, {
        autoIncrement: true,
      });
  }
}

export default DatabaseManager;
