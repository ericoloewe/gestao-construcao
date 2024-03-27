"use client";

import React, { createContext, useState, useEffect } from "react"

interface StorageProviderContext {
  add: (collectionName: AvailableCollections, doc: any) => Promise<void>
  update: (collectionName: AvailableCollections, id: string, doc: any) => Promise<void>
  get: (collectionName: AvailableCollections, id: string) => Promise<void>
}

const StorageContext = createContext<StorageProviderContext>({
  add: () => Promise.resolve(),
  update: () => Promise.resolve(),
  get: () => Promise.resolve(),
});

export enum AvailableCollections {
  default = "default",
  simulador = "simulador",
}

const collections = {} as { [key: string]: PouchDB.Database };

export function StorageProvider(props: any) {
  let PouchDB: PouchDB.Static = {} as any;

  useEffect(() => {
    startStorage();
  }, []);

  async function startStorage() {
    PouchDB = (await import('pouchdb-browser')).default as any;
  }

  async function add(collectionName: AvailableCollections, doc: any) {
    return await getCollection(collectionName).post({
      ...doc,
    });
  }

  async function update(collectionName: AvailableCollections, id: string, doc: any) {
    return await getCollection(collectionName).put({
      ...doc,
      "_id": id,
    });
  }

  async function get(collectionName: AvailableCollections, id: string) {
    return await getCollection(collectionName).get(id);
  }

  function getCollection(collectionName: AvailableCollections) {
    if (collections[collectionName] == null) {
      collections[collectionName] = new PouchDB(collectionName);
    }

    return collections[collectionName];
  }

  return (
    <StorageContext.Provider
      value={{
        add,
        update,
        get,
      }}
      {...props} />
  )
}

export const useStorage = () => React.useContext(StorageContext)
