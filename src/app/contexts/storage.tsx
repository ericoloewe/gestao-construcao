"use client";


import React, { createContext, useState, useEffect } from "react"
import { useAuth } from "./auth";
import { GDriveUtil } from "../utils/gdrive";
import { DbRepository } from "../utils/db-repository";

interface StorageProviderContext {
  repository: DbRepository
  isDbOk: boolean
  isGDriveSaveLoading: boolean
  isGDriveLoadLoading: boolean
  doGDriveSave: () => void
  doGDriveLoad: () => void
}

const StorageContext = createContext<StorageProviderContext>({
  repository: {} as any,
  isDbOk: false,
  isGDriveSaveLoading: false,
  isGDriveLoadLoading: false,
  doGDriveSave: () => { },
  doGDriveLoad: () => { },
});

export enum AvailableCollections {
  default = "default",
  simulador = "simulador",
}

export function StorageProvider(props: any) {
  const [repository, setRepository] = useState<DbRepository>({} as any);
  const [isDbOk, setIsDbOk] = useState<boolean>(false);
  const [isGDriveSaveLoading, setIsGDriveSaveLoading] = useState<boolean>(false);
  const [isGDriveLoadLoading, setIsGDriveLoadLoading] = useState<boolean>(false);
  const { isAuthOk } = useAuth();

  useEffect(() => {
    startStorage();
  }, []);

  async function startStorage() {
    console.log('startStorage');
    const repository = await DbRepository.create();

    setRepository(repository);
    setIsDbOk(true);
    console.log('startStorage isDbOk');
  }

  async function doGDriveSave() {
    setIsGDriveSaveLoading(true);
    console.log('doGDriveSave start');

    if (!isAuthOk)
      throw new Error('you must login on gdrive')

    updateGDrive();

    console.log('doGDriveSave end');
    setIsGDriveSaveLoading(false);
  }

  async function doGDriveLoad() {
    setIsGDriveLoadLoading(true);
    console.log('doGDriveLoad start');
    if (!isAuthOk)
      throw new Error('you must login on gdrive')

    await loadGDrive();
    console.log('doGDriveLoad end');
    setIsGDriveLoadLoading(false);
  }

  async function loadGDrive() {
    console.log('loadGDrive');

    const file = await GDriveUtil.getFirstFileByName(GDriveUtil.DB_FILE_NAME);

    console.log("file", file);

    if (file) {
      const fileData = await GDriveUtil.getFileById(file.id);


      const dumpUnescape = atob(fileData?.body || '');
      const dump = decodeURIComponent(escape(dumpUnescape));

      await DbRepository.persistLocalDump(dump);
      await startStorage()
    }
  }

  async function updateGDrive() {
    const dump = await DbRepository.exportLocalDump();

    const dumpEscape = unescape(encodeURIComponent(dump || ''));

    const baseDump = btoa(dumpEscape)
    console.info('updateGDrive');

    const file = await GDriveUtil.getFirstFileByName(GDriveUtil.DB_FILE_NAME);

    if (file) {
      await GDriveUtil.updateFile(file.id, baseDump);
    } else {
      await GDriveUtil.createFile(GDriveUtil.DB_FILE_NAME, baseDump);
    }
  }

  return (
    <StorageContext.Provider
      value={{
        repository,
        isDbOk,
        isGDriveSaveLoading,
        isGDriveLoadLoading,
        doGDriveSave,
        doGDriveLoad,
      }}
      {...props} />
  )
}

export const useStorage = () => React.useContext(StorageContext)
