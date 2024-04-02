"use client";


import path from "path"
import React, { createContext, useState, useEffect } from "react"
import { useAuth } from "./auth";
import { GDriveUtil } from "../utils/gdrive";

interface StorageProviderContext {
  add: (collectionName: AvailableCollections, doc: any) => Promise<Promise<PouchDB.Core.Response>>
  update: (collectionName: AvailableCollections, id: string, doc: any) => Promise<void>
  get: (collectionName: AvailableCollections, id: string) => Promise<PouchDB.Core.Document<any> & PouchDB.Core.GetMeta>
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

const collections = {} as { [key: string]: PouchDB.Database };
const DB_FILE_NAME = 'gestao-construcao.settings.json';

export function StorageProvider(props: any) {
  const [isDbOk, setIsDbOk] = useState<boolean>();
  const [dbMethod, setPouchDB] = useState<{ PouchDB: PouchDB.Static }>({ dbMethod: {} } as any);
  // let PouchDB: PouchDB.Static = {} as any;

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

    if (file) {
      console.log(dbMethod.PouchDB);
      
      // TODO:
    } else {
      console.log(PouchDB);
      await GDriveUtil.createFile(DB_FILE_NAME, '{}');
    }
  }

  async function startStorage() {
    const PouchDB = (await import('pouchdb-browser')).default as any;

    setPouchDB({ PouchDB });
    setIsDbOk(true);
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

  function getCollection(collectionName: AvailableCollections) {
    if (collections[collectionName] == null) {
      collections[collectionName] = new dbMethod.PouchDB(collectionName);
    }

    return collections[collectionName];
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
