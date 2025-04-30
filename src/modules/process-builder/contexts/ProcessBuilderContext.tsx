'use client'
import { createContext, useContext, ReactNode, useState } from 'react'
import { Node, Edge } from 'reactflow'
import { FormComponent } from '../features/form/types'

interface ProcessBuilderContextType {
  name: string
  setName: (name: string) => void
  workflowNodes: Node[]
  workflowEdges: Edge[]
  formComponents: FormComponent[]
  setWorkflowNodes: (nodes: Node[]) => void
  setWorkflowEdges: (edges: Edge[]) => void
  setFormComponents: (components: FormComponent[]) => void
  nodesTypes: []
}

const ProcessBuilderContext = createContext<ProcessBuilderContextType | undefined>(undefined)

interface ProcessBuilderProviderProps {
  children: ReactNode
  nodesTypes: []
  initialData?: {
    workflowNodes?: Node[]
    workflowEdges?: Edge[]
    formComponents?: FormComponent[]
  }
}

export const ProcessBuilderProvider = ({
  children,
  initialData,
  nodesTypes,
}: ProcessBuilderProviderProps) => {
  const [name, setName] = useState('')
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>(initialData?.workflowNodes || [])
  const [workflowEdges, setWorkflowEdges] = useState<Edge[]>(initialData?.workflowEdges || [])
  const [formComponents, setFormComponents] = useState<FormComponent[]>(
    initialData?.formComponents || [],
  )

  return (
    <ProcessBuilderContext.Provider
      value={{
        name,
        setName,
        workflowNodes,
        workflowEdges,
        formComponents,
        setWorkflowNodes,
        setWorkflowEdges,
        setFormComponents,
        nodesTypes: nodesTypes || [],
      }}
    >
      {children}
    </ProcessBuilderContext.Provider>
  )
}

export const useProcessBuilder = () => {
  const context = useContext(ProcessBuilderContext)
  if (context === undefined) {
    throw new Error('useProcessBuilder must be used within a ProcessBuilderProvider')
  }
  return context
}
