"use client";

import React, { createContext, useState, useEffect } from "react"

const StorageContext = createContext({
});


export function StorageProvider(props: any) {
  let db: PouchDB.Database = {} as any;

  useEffect(() => {
    startStorage();
  }, []);

  async function startStorage() {
    const PouchDB = (await import('pouchdb-browser')).default as any;

    db = new PouchDB('default');
  }

  async function add(id: string, doc: any) {
    return await db.put({
      ...doc,
      '_id': id,
    });
  }

  async function get(id: string) {
    return await db.get(id);
  }

  return (
    <StorageContext.Provider
      value={{
        add,
        get,
      }}
      {...props} />
  )
}

export const useStorage = () => React.useContext(StorageContext)