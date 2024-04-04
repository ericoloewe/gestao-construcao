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

let runned = false;

export function StorageProvider(props: any) {
  const [repository, setRepository] = useState<DbRepository>({} as any);
  const [isDbOk, setIsDbOk] = useState<boolean>();
  const { isAuthOk } = useAuth();

  useEffect(() => {
    if (!runned) {
      startStorage();
    }

    runned = true
  }, []);

  useEffect(() => {
    if (isAuthOk) {
      loadGDrive();
    }
  }, [isAuthOk]);

  async function loadGDrive() {
    console.log('loadGDrive');

    const file = await GDriveUtil.getFirstFileByName(GDriveUtil.DB_FILE_NAME);

    if (file) {
      const fileData = await GDriveUtil.getFileById(file.id);

      await startStorage(JSON.parse(fileData?.body || ''))
    }
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
