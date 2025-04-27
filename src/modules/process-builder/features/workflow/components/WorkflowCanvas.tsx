'use client'

import { FC, memo, useEffect, useState } from 'react'
import ReactFlow, { Edge, DefaultEdgeOptions, Node, ConnectionMode } from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext'
import { CustomNode } from './nodes/base/CustomNode'
import { NodeToolbar } from './NodeToolbar'
import WorkflowConnection from './edges/WorkflowConnection'
import { ActivityNode } from './nodes/actions/ActivityNode'
import { WebhookNode } from './nodes/actions/WebhookNode'
import { ManualTriggerNode } from './nodes/triggers/ManualTriggerNode'
import { CronTriggerNode } from './nodes/triggers/CronTriggerNode'
import { DecisionNode } from './nodes/DecisionNode'
import { JoinNode } from './nodes/JoinNode'
import { WorkflowTriggerNode } from './nodes/triggers/WorkflowTriggerNode'
import { NodeSettingsModal } from './nodes/NodeSettingsModal'
import { Background, Controls, Panel } from 'reactflow'
import { toast } from 'sonner'

const nodeTypes = {
  customNode: CustomNode,
  manualTriggerNode: ManualTriggerNode,
  cronTriggerNode: CronTriggerNode,
  workflowTriggerNode: WorkflowTriggerNode,
  activityNode: ActivityNode,
  webhookNode: WebhookNode,
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

export const WorkflowCanvas: FC<WorkflowCanvasProps> = memo(() => {
  const {
    nodes,
    edges,
    onConnect,
    onNodesChange,
    onEdgesChange,
    setReactFlowInstance,
    reactFlowWrapper,
    onDrop,
    onDragOver,
  } = useWorkflowBuilder()

  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleConnect = (params: any) => {
    if (params.source === params.target) {
      toast.error('Não é possível conectar um nó a si mesmo')
      return
    }
    onConnect(params)
  }

  const handleNodeSettings = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setSelectedNode(node)
      setIsSettingsModalOpen(true)
    }
  }

  const handleSettingsClose = () => {
    setIsSettingsModalOpen(false)
    setSelectedNode(null)
  }

  return (
    <div className="h-full relative bg-gray-50" ref={reactFlowWrapper}>
      <div className="absolute inset-0">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onSettings: handleNodeSettings,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
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
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <NodeToolbar />
          </Panel>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-200 max-w-md text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comece seu workflow</h3>
                <p className="text-gray-600">
                  Arraste um nó de início de fluxo para o canvas para começar a construir seu
                  workflow.
                </p>
              </div>
            </div>
          )}
        </ReactFlow>
      </div>
      <NodeSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleSettingsClose}
        node={selectedNode}
      />
    </div>
  )
})

WorkflowCanvas.displayName = 'WorkflowCanvas'
