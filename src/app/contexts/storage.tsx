"use client";


import React, { createContext, useState, useEffect } from "react"
import { useAuth } from "./auth";
import { GDriveUtil } from "../utils/gdrive";
import { DbRepository } from "../utils/db-repository";

interface StorageProviderContext {
  repository: DbRepository
  isDbOk: boolean
}

const StorageContext = createContext<StorageProviderContext>({
  repository: {} as any,
  isDbOk: false,
});

export enum AvailableCollections {
  default = "default",
  simulador = "simulador",
}

const DB_FILE_NAME = 'gestao-construcao.settings.db';

let runned = false;

export function StorageProvider(props: any) {
  const [repository, setRepository] = useState<DbRepository>({} as any);
  const [isDbOk, setIsDbOk] = useState<boolean>();
  const { isAuthOk } = useAuth();

  useEffect(() => {
    if (!runned) {
      handleUnloadEvent();
      startStorage();
    }

    runned = true
  }, []);

  useEffect(() => {
    if (isAuthOk) {
      loadGDrive();
    }
  }, [isAuthOk]);

  async function updateGDrive() {
    console.log('updateGDrive');

    const file = await GDriveUtil.getFirstFileByName(DB_FILE_NAME);
    const dump = repository?.export();

    if (file) {
      // console.log(dbMethod.PouchDB);

      // TODO:
      await GDriveUtil.updateFile(file.id, dump);
    } else {
      // console.log(PouchDB);
      await GDriveUtil.createFile(DB_FILE_NAME, dump);
    }
  }

  async function loadGDrive() {
    console.log('loadGDrive');

    const file = await GDriveUtil.getFirstFileByName(DB_FILE_NAME);

    if (file) {
      const fileData = await GDriveUtil.getFileById(file.id);

      await startStorage(JSON.parse(fileData?.body || ''))
    }
  }

  function handleUnloadEvent() {
    window.onbeforeunload = function (e) {
      repository.persistDb();

      var message = "Ter certeza que deseja sair?", e = e || window.event;

      // For IE and Firefox
      if (e) {
        e.returnValue = message;
      }

      // For Safari
      return message;
    };
  }

  async function startStorage(data?: any) {
    console.log('startStorage');
    const repository = await DbRepository.create(data);

    setRepository(repository);
    setIsDbOk(true);
  }

  return (
    <StorageContext.Provider
      value={{
        repository,
        isDbOk,
      }}
      {...props} />
  )
}

export const useStorage = () => React.useContext(StorageContext)
