import initSqlJs from 'sql.js';

let SQL: import('sql.js').SqlJsStatic

export class DbRepository {
  private constructor(private db: import('sql.js').Database) {
    this.createTypesIfNeed();
  }

  public static async create(data?: any) {
    if (SQL == null) {
      SQL = await initSqlJs({
        // Fetch sql.js wasm file from CDN
        // This way, we don't need to deal with webpack
        locateFile: (file) => `/${file}`,
      })
    }

    const db = new SQL.Database(data);

    return new DbRepository(db);
  }

  
  public export() {
    return this.db.export();
  }

  
  public async getSimulacao(id: string) {
    const result = this.db.exec('select * from simulacao where id = $id', { "$id": id });

    console.log(result);
  }

  private createTypesIfNeed() {

  }
}