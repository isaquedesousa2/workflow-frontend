import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { BaseNodeConfig } from '../types/node-settings'

interface NodeConfigContextType {
  settings: Record<string, BaseNodeConfig>
  updateNodeConfig: <T>(nodeId: string, settings: Partial<T>) => void
  getNodeConfig: <T>(nodeId: string) => T | undefined
  createNodeConfig: (nodeId: string, settings: BaseNodeConfig) => void
  resetNodeConfig: (nodeId: string) => void
}

const NodeConfigContext = createContext<NodeConfigContextType | undefined>(undefined)

export const NodeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<any>({})

  function updateNodeConfig<T>(nodeId: string, newSettings: Partial<T>) {
    setSettings((prev: any) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        ...newSettings,
      },
    }))
  }

  const getNodeConfig = useCallback((nodeId: string) => settings[nodeId], [settings])

  const resetNodeConfig = useCallback((nodeId: string) => {
    setSettings((prev: any) => {
      const { [nodeId]: _, ...rest } = prev
      return rest
    })
  }, [])

  const createNodeConfig = useCallback((nodeId: string, settings: BaseNodeConfig) => {
    setSettings((prev: any) => ({
      ...prev,
      [nodeId]: settings,
    }))
  }, [])

  return (
    <NodeConfigContext.Provider
      value={{
        settings,
        updateNodeConfig,
        getNodeConfig,
        resetNodeConfig,
        createNodeConfig,
      }}
    >
      {children}
    </NodeConfigContext.Provider>
  )
}

export const useNodeConfig = () => {
  const context = useContext(NodeConfigContext)
  if (context === undefined) {
    throw new Error('useNodeConfig must be used within a NodeConfigProvider')
  }
  return context
}
