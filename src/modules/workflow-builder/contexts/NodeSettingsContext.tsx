import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { BaseNodeConfig } from '../types/node-settings'

interface NodeSettingsContextType {
  settings: Record<string, BaseNodeConfig>
  updateNodeSettings: <T>(nodeId: string, settings: Partial<T>) => void
  getNodeSettings: <T>(nodeId: string) => T | undefined
  createNodeSettings: (nodeId: string, settings: BaseNodeConfig) => void
  resetNodeSettings: (nodeId: string) => void
}

const NodeSettingsContext = createContext<NodeSettingsContextType | undefined>(undefined)

export const NodeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<any>({})

  function updateNodeSettings<T>(nodeId: string, newSettings: Partial<T>) {
    setSettings((prev: any) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        ...newSettings,
      },
    }))
  }

  const getNodeSettings = useCallback((nodeId: string) => settings[nodeId], [settings])

  const resetNodeSettings = useCallback((nodeId: string) => {
    setSettings((prev: any) => {
      const { [nodeId]: _, ...rest } = prev
      return rest
    })
  }, [])

  const createNodeSettings = useCallback((nodeId: string, settings: BaseNodeConfig) => {
    setSettings((prev: any) => ({
      ...prev,
      [nodeId]: settings,
    }))
  }, [])

  return (
    <NodeSettingsContext.Provider
      value={{
        settings,
        updateNodeSettings,
        getNodeSettings,
        resetNodeSettings,
        createNodeSettings,
      }}
    >
      {children}
    </NodeSettingsContext.Provider>
  )
}

export const useNodeSettings = () => {
  const context = useContext(NodeSettingsContext)
  if (context === undefined) {
    throw new Error('useNodeSettings must be used within a NodeSettingsProvider')
  }
  return context
}
