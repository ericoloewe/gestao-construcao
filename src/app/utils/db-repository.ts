import moment from 'moment';
import initSqlJs from 'sql.js';

let SQL: import('sql.js').SqlJsStatic

const DB_NAME = 'gestao-construcao.settings.db';

export class DbRepository {
  private constructor(private db: import('sql.js').Database) { }

  public static async create(data?: any) {
    if (SQL == null) {
      SQL = await initSqlJs({
        // Fetch sql.js wasm file from CDN
        // This way, we don't need to deal with webpack
        locateFile: (file) => `/${file}`,
      })
    }

    debugger

    const localDb = localStorage.getItem(DB_NAME);

    if (data == null && localDb != null) {
      data = Buffer.from(localDb, 'utf8');
    }

    const db = new SQL.Database(data);

    const repo = new DbRepository(db);

    await repo.runMigrations();

    // console.log(new SQL.Database(Buffer.from(db.export())))

    return repo;
  }


  public export() {
    return this.db.export();
  }

  public async persistDb() {
    await Promise.resolve();

    const exp = this.export();
    const db = Buffer.from(exp).toString('utf8');

    console.log(db.length);


    localStorage.setItem(DB_NAME, db);
  }

  public async save(data: any) {
    await Promise.resolve();

    let result = {} as any;

    if (data?.id != null)
      result = this.update(data)
    else
      result = this.insert(data);

    this.persistDb();

    return result;
  }

  public async getSimulacao(id: string) {
    await Promise.resolve();

    const result = this.db.exec('select * from simulacao where id = $id', { "$id": id });

    if (result.length === 0)
      throw new Error('simulacao não encontrada');

    return this.parseSqlResultToObj(result)[0][0];
  }

  private parseSqlResultToObj(result: initSqlJs.QueryExecResult[]) {
    return result.map(res => res.values.map(values => res.columns.reduce((p, n, i) => {
      p[n] = values[i];

      return p;
    }, {} as any)));
  }

  private async insert(data: any) {
    const nextData = { ...data, createdDate: new Date() };
    const keys = Object.keys(nextData).filter(k => nextData[k] !== undefined);
    const command = `INSERT INTO simulacao (${keys.join(', ')}) VALUES (${keys.map(k => `$${k}`).join(', ')});SELECT LAST_INSERT_ROWID();`;
    const params = keys.reduce((p, n) => {
      let value = nextData[n] || null;

      if (value instanceof Date) {
        value = moment(value).format();
      }

      p[`$${n}`] = value;

      return p
    }, {} as any);

    const result = this.db.exec(command, params);

    nextData.id = result[0].values[0][0];

    return nextData;
  }

  private async update(data: any) {
    const nextData = { ...data, updatedDate: new Date() };
    const keys = Object.keys(nextData).filter(k => nextData[k] !== undefined);
    const command = `UPDATE simulacao SET ${keys.map(k => `${k}=$${k}`).join(', ')} WHERE id=$id`;
    const params = keys.reduce((p, n) => {
      let value = nextData[n] || null;

      if (value instanceof Date) {
        value = moment(value).format();
      }

      p[`$${n}`] = value;

      return p
    }, {} as any);

    this.db.exec(command, params);

    return this.getSimulacao(data.id);
  }

  private async runMigrations() {
    await Promise.resolve();

    this.db.exec(`CREATE TABLE IF NOT EXISTS "simulacao" ( "id" INTEGER NOT NULL, "titulo" TEXT NULL DEFAULT NULL, "area" REAL NULL DEFAULT 0, "valor" REAL NULL DEFAULT 0, "itbi" REAL NULL DEFAULT 0, "escrituraERegistro" REAL NULL DEFAULT 0, "iptu" REAL NULL DEFAULT 0, "valorTotal" REAL NULL DEFAULT 0, "valorEntrada" REAL NULL DEFAULT 0, "taxaDeJuros" REAL NULL DEFAULT 0, "mesDeInicio" REAL NULL DEFAULT 0, "prazo" REAL NULL DEFAULT 0, "createdDate" DATETIME NOT NULL, "updatedDate" DATETIME NULL,PRIMARY KEY ("id"));`);
  }
}