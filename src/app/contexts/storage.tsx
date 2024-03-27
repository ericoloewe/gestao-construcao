"use client";

import React, { createContext, useState, useEffect } from "react"

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

export function StorageProvider(props: any) {
  const [isDbOk, setIsDbOk] = useState<boolean>();
  const [dbMethod, setPouchDB] = useState<{ PouchDB: PouchDB.Static }>({ dbMethod: {} } as any);
  // let PouchDB: PouchDB.Static = {} as any;

  useEffect(() => {
    startStorage();
  }, []);

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
