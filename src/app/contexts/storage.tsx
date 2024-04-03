"use client";


import React, { createContext, useState, useEffect } from "react"
import { useAuth } from "./auth";
import { GDriveUtil } from "../utils/gdrive";
import initSqlJs from "sql.js";

interface StorageProviderContext {
  add: (collectionName: AvailableCollections, doc: any) => Promise<any>
  update: (collectionName: AvailableCollections, id: string, doc: any) => Promise<void>
  get: (collectionName: AvailableCollections, id: string) => Promise<any>
  isDbOk: boolean
}

const StorageContext = createContext<StorageProviderContext>({
  add: () => Promise.resolve({} as any),
  update: () => Promise.resolve(),
  get: () => Promise.resolve(),
  isDbOk: false,
});

export enum AvailableCollections {
  default = "default",
  simulador = "simulador",
}

const DB_FILE_NAME = 'gestao-construcao.settings.config';

export function StorageProvider(props: any) {
  const [db, setDb] = useState<import('sql.js').Database>();
  const [isDbOk, setIsDbOk] = useState<boolean>();
  const { isAuthOk } = useAuth();

  useEffect(() => {
    startStorage();
  }, []);

  useEffect(() => {
    if (isAuthOk && isDbOk) {
      loadGDrive();
    }
  }, [isAuthOk, isDbOk]);

  async function loadGDrive() {
    console.log('loadGDrive');

    const file = await GDriveUtil.getFirstFileByName(DB_FILE_NAME);
    const dump = db?.export();

    if (file) {
      // console.log(dbMethod.PouchDB);

      // TODO:
      await GDriveUtil.updateFile(file.id, dump);
    } else {
      // console.log(PouchDB);
      await GDriveUtil.createFile(DB_FILE_NAME, dump);
    }
  }

  async function startStorage() {
    const SQL = await initSqlJs({
      // Fetch sql.js wasm file from CDN
      // This way, we don't need to deal with webpack
      locateFile: (file) => `/${file}`,
    })

    const db = new SQL.Database();

    setDb(db);
  }

  async function add(collectionName: AvailableCollections, doc: any) {
    return await getCollection(collectionName).post({
      ...doc,
    });
  }

  async function update(collectionName: AvailableCollections, id: string, doc: any) {
    const collection = getCollection(collectionName);

    const dbDoc = await collection.get(id);

    collection.put({
      ...dbDoc,
      ...doc,
    });
  }

  async function get(collectionName: AvailableCollections, id: string) {
    return await getCollection(collectionName).get(id);
  }

  return (
    <StorageContext.Provider
      value={{
        add,
        update,
        get,
        isDbOk,
      }}
      {...props} />
  )
}

export const useStorage = () => React.useContext(StorageContext)
