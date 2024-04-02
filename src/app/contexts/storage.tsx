"use client";


import path from "path"
import React, { createContext, useState, useEffect } from "react"
import { useAuth } from "./auth";
import { GDriveUtil } from "../utils/gdrive";
//@ts-ignore
import replicationStream from 'pouchdb-replication-stream';

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

    newFunction();

    if (file) {
      // console.log(dbMethod.PouchDB);

      // TODO:
    } else {
      // console.log(PouchDB);
      await GDriveUtil.createFile(DB_FILE_NAME, '{}');
    }
  }

  async function startStorage() {
    const PouchDB = (await import('pouchdb-browser')).default as any;

    // @ts-ignore
    // var replicationStream = (await import('pouchdb-replication-stream')).default as any;

    // console.log(replicationStream);

    PouchDB.plugin(replicationStream.plugin);
    PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);


    setPouchDB({ PouchDB });
    setIsDbOk(true);
  }

  function newFunction() {
    var dumpedString = '';
    var MemoryStream = require('memorystream');
    var stream = new MemoryStream();

    stream.on('data', function (chunk: any) {
      dumpedString += chunk.toString();
    });

    var db = getCollection(AvailableCollections.simulador);

    window.Promise = Promise;

    // @ts-ignore
    db.dump(stream).then(function () {
      console.log('Yay, I have a dumpedString: ' + dumpedString);
    }).catch(function (err: any) {
      console.log('oh no an error', err);
    });
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
