import React, { createContext, useState, useEffect } from "react"
import PouchDb from 'pouchdb-browser';

const StorageContext = createContext({
});

const db = new PouchDb('default');

export function StorageProvider(props: any) {

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