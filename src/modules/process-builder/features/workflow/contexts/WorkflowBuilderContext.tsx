'use client'

import { useRef } from 'react'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import {
  Edge,
  Node,
  Connection,
  NodeChange,
  EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
} from 'reactflow'
import { useNodeConfig } from './NodeConfigContext'

interface WorkflowBuilderContextData {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  removeEdge: (edgeId: string) => void
  processName: string
  setProcessName: Dispatch<SetStateAction<string>>
  onConnect: (params: Connection | Edge) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  setReactFlowInstance: Dispatch<SetStateAction<ReactFlowInstance | null>>
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>
  onDrop: (event: React.DragEvent) => void
  onDragOver: (event: React.DragEvent) => void
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextData>(
  {} as WorkflowBuilderContextData,
)

export const useWorkflowBuilder = () => {
  const context = useContext(WorkflowBuilderContext)
  if (!context) {
    throw new Error('useWorkflowBuilder must be used within a WorkflowBuilderProvider')
  }
  return context
}

interface WorkflowBuilderProviderProps {
  children: ReactNode
}

export const WorkflowBuilderProvider: FC<WorkflowBuilderProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [processName, setProcessName] = useState('Novo Processo')
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const { createNodeConfig } = useNodeConfig()

  const removeEdge = (edgeId: string) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId))
  }

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds: Edge[]) => addEdge(params, eds))
    },
    [setEdges, nodes, edges],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds: Node[]) => applyNodeChanges(changes, nds))
    },
    [setNodes],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'))

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const nodeId = `${nodeData.type}-${Date.now()}`
      const newNode: Node = {
        id: nodeId,
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label,
          type: nodeData.type,
          icon: nodeData.icon,
          description: nodeData.description,
          ...nodeData.initialData,
          onDelete: (nodeId: string) => {
            setNodes((nds: Node[]) => nds.filter((node: Node) => node.id !== nodeId))
            setEdges((eds: Edge[]) =>
              eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId),
            )
          },
        },
      }

      createNodeConfig(nodeId, {
        position: { x: 0, y: 0 },
        id: nodeId,
        type: nodeData.type,
        label: nodeData.label,
        description: nodeData.description || '',
        ...(nodeData.type === 'manualTriggerNode' && {
          mechanism: 'NONE',
          specificGroupId: '',
        }),
        ...(nodeData.type === 'cronTriggerNode' && {
          intervalType: 'DAILY',
          schedule: '0 9 * * *',
        }),
      })

      setNodes((nds: Node[]) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes, setEdges, createNodeConfig],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <WorkflowBuilderContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        removeEdge,
        processName,
        setProcessName,
        onConnect,
        onNodesChange,
        onEdgesChange,
        setReactFlowInstance,
        onDrop,
        reactFlowWrapper,
        onDragOver,
      }}
    >
      {children}
    </WorkflowBuilderContext.Provider>
  )
}
