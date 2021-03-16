import * as Zod from "zod";
import Config from "../shared/config";

class DatabaseManager {
  static NAME = "db1";

  static STORE = "object-store-1";

  config: Config;

  log: typeof Config.prototype.log;

  request: IDBOpenDBRequest;

  private db?: IDBDatabase;

  constructor(config: Config) {
    this.config = config;
    this.log = this.config.log.bind(this);
    this.request = globalThis.indexedDB.open(DatabaseManager.NAME);
    this.request.onblocked = (x) => this.log(x, "warn");
    this.request.onerror = (x) => this.log(x, "error");
    this.request.onsuccess = (x) => this.success(x);
    this.request.onupgradeneeded = (x) => this.upgradeNeeded(x);
    this.log("constructor");
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
    db.onabort = (ev) => this.log(ev, "warn");
    db.onclose = (ev) => this.log(ev);
    db.onerror = (ev) => this.log(ev, "error");
    db.onversionchange = (ev) => this.log(ev);
    this.db = db;
  }

  private upgradeNeeded(event: IDBVersionChangeEvent): void {
    this.log("upgradeNeeded");

    Zod.instanceof(IDBDatabase)
      .parse(Zod.instanceof(IDBRequest).parse(event.target).result)
      .createObjectStore(DatabaseManager.STORE, {
        autoIncrement: true,
      });
  }
}

export default DatabaseManager;

// getID(): string {
//   if (this.id) return this.id;

//   return Zod.string().parse(this.databaseManager.get("id").result);
// }

// setID(id: string): void {
//   this.databaseManager.put("id", id);
//   this.id = id;
// }
