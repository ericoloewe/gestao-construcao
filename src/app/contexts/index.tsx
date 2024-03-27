import React from "react"

import { EnvProvider } from "./env"
import { StorageProvider } from "./storage"
import { LoggingProvider } from "./logging"

export function AppProviders({ children }: any) {
  return (
    <EnvProvider>
      <LoggingProvider>
        <StorageProvider>
          {children}
        </StorageProvider>
      </LoggingProvider>
    </EnvProvider>
  )
}