'use client'

import { FC, useCallback, memo, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  addEdge,
  Connection,
  Edge,
  DefaultEdgeOptions,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  NodeMouseHandler,
  ReactFlowInstance,
  ConnectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext'
import { CustomNode } from './nodes/base/CustomNode'
import { NodeToolbar } from './NodeToolbar'
import WorkflowConnection from './edges/WorkflowConnection'
import { NodeSelectionModal } from './NodeSelectionModal'
import { NodeTypes } from '../types'
import { ActivityNode } from './nodes/ActivityNode'
import { WebhookNode } from './nodes/WebhookNode'
import { ConditionNode } from './nodes/ConditionNode'
import { NodeDrawer } from './NodeDrawer'
import { StartNode } from './nodes/StartNode'
import { EndNode } from './nodes/EndNode'
import { DecisionNode } from './nodes/DecisionNode'
import { JoinNode } from './nodes/JoinNode'

const nodeTypes = {
  customNode: CustomNode,
  startNode: StartNode,
  endNode: EndNode,
  activityNode: ActivityNode,
  webhookNode: WebhookNode,
  conditionNode: ConditionNode,
  decisionNode: DecisionNode,
  joinNode: JoinNode,
}

const edgeTypes = {
  custom: WorkflowConnection,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  style: {
    strokeWidth: 3,
    stroke: '#8b5cf6',
  },
  type: 'custom',
}

interface WorkflowData {
  nodes: Node[]
  edges: Edge[]
}

interface WorkflowCanvasProps {
  onSave?: (workflow: WorkflowData) => void
}

const createInitialNodes = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
): Node[] => {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'startNode',
      position: { x: 0, y: 250 },
      data: {
        label: 'Início do Fluxo',
        type: 'Início',
        icon: '🎯',
        description: 'Ponto inicial do fluxo de trabalho',
        onDelete: (nodeId: string) => {
          setNodes((nds: Node[]) => nds.filter((node: Node) => node.id !== nodeId))
          setEdges((eds: Edge[]) =>
            eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId),
          )
        },
      },
    },
    {
      id: '2',
      type: 'endNode',
      position: { x: 2000, y: 250 },
      data: {
        label: 'Finalizar Fluxo',
        type: 'Fim',
        icon: '🔚',
        description: 'Ponto final do fluxo de trabalho',
        onDelete: (nodeId: string) => {
          setNodes((nds: Node[]) => nds.filter((node: Node) => node.id !== nodeId))
          setEdges((eds: Edge[]) =>
            eds.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId),
          )
        },
      },
    },
  ]
  return initialNodes
}

export const WorkflowCanvas: FC<WorkflowCanvasProps> = memo(() => {
  const { nodes, edges, setNodes, setEdges, setSelectedNode, addNodeBetween } = useWorkflowBuilder()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [isNodeSelectionOpen, setIsNodeSelectionOpen] = useState(false)
  const [nodeSelectionData, setNodeSelectionData] = useState<{
    sourceId: string
    targetId: string
  } | null>(null)

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(createInitialNodes(setNodes, setEdges))
    }
  }, [nodes.length, setNodes, setEdges])

  useEffect(() => {
    const handleDeleteEdge = (event: CustomEvent) => {
      const { edgeId } = event.detail
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
    }

    window.addEventListener('deleteEdge', handleDeleteEdge as EventListener)
    return () => {
      window.removeEventListener('deleteEdge', handleDeleteEdge as EventListener)
    }
  }, [setEdges])

  useEffect(() => {
    const handleAddNodeBetween = (event: CustomEvent) => {
      const { sourceId, targetId } = event.detail
      setNodeSelectionData({ sourceId, targetId })
      setIsNodeSelectionOpen(true)
    }

    window.addEventListener('addNodeBetween', handleAddNodeBetween as EventListener)
    return () => {
      window.removeEventListener('addNodeBetween', handleAddNodeBetween as EventListener)
    }
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

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

      const newNode: Node = {
        id: `${nodeData.type}-${Date.now()}`,
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

      setNodes((nds: Node[]) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes, setEdges],
  )

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds: Edge[]) => addEdge(params, eds))
    },
    [setEdges, nodes, edges],
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNode(node)
    },
    [setSelectedNode],
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

  const handleNodeSelect = (nodeType: NodeTypes) => {
    if (nodeSelectionData) {
      addNodeBetween(nodeSelectionData.sourceId, nodeSelectionData.targetId, nodeType)
    }
    setIsNodeSelectionOpen(false)
    setNodeSelectionData(null)
  }

  return (
    <div className="h-full relative bg-gray-50" ref={reactFlowWrapper}>
      <div className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="bg-[#fafafa]"
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          connectionMode={ConnectionMode.Strict}
          connectionLineStyle={{ stroke: '#8b5cf6', strokeWidth: 3 }}
        ></ReactFlow>
      </div>
      <NodeToolbar />
      {/* <NodeSelectionModal
        isOpen={isNodeSelectionOpen}
        onClose={() => {
          setIsNodeSelectionOpen(false)
          setNodeSelectionData(null)
        }}
        onSelect={handleNodeSelect}
      /> */}
      {/* <NodeDrawer /> */}
    </div>
  )
})

WorkflowCanvas.displayName = 'WorkflowCanvas'
