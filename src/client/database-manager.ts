import * as Zod from "zod";
import ClientBase from "./client-base";
import LogLevel from "../log-level";

enum DBNames {
  DB1 = "db1",
}

class DatabaseManager extends ClientBase {
  static all = new Set<DatabaseManager>();

  static init(): Set<DatabaseManager> {
    Object.values(DBNames).forEach((s) => new DatabaseManager(s));
    return DatabaseManager.all;
  }

  dbName: DBNames;

  private _db?: IDBDatabase;
  private _request?: IDBOpenDBRequest;

  constructor(dbName: DBNames) {
    super();
    this.dbName = dbName;
    this.request = globalThis.indexedDB.open(this.dbName);
    DatabaseManager.all.add(this);
  }

  get db(): IDBDatabase {
    return Zod.instanceof(IDBDatabase).parse(this._db);
  }

  set db(db: IDBDatabase) {
    db.onabort = (ev) => this.log(ev, LogLevel.WARN);
    db.onclose = (ev) => this.log(ev);
    db.onerror = (ev) => this.log(ev, LogLevel.ERROR);
    db.onversionchange = (ev) => this.log(ev);
    this._db = db;
  }

  get request(): IDBOpenDBRequest {
    return Zod.instanceof(IDBOpenDBRequest).parse(this._request);
  }

  set request(request: IDBOpenDBRequest) {
    request.onblocked = (ev) => this.log(ev, LogLevel.WARN);
    request.onerror = (ev) => this.log(ev, LogLevel.ERROR);
    request.onsuccess = (ev) => this.success(ev);
    request.onupgradeneeded = () => this.upgradeNeeded();
    this._request = request;
  }

  success(event: Event): void {
    this.log("success");
    this.db = Zod.instanceof(IDBOpenDBRequest).parse(event.target).result;
  }

  upgradeNeeded(): void {
    this.log("upgradeNeeded");
  }
}

export default DatabaseManager;
export { DBNames };
