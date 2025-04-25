import { memo } from 'react'
import { BaseNode } from '../base/BaseNode'
import { NodeProps } from 'reactflow'

export interface WorkflowTriggerNodeData {
  label: string
  type: string
  description: string
  workflowId: string
  onDelete?: () => void
  onSettings?: () => void
}

export const WorkflowTriggerNode = memo(
  ({ data, selected, ...props }: NodeProps<WorkflowTriggerNodeData>) => {
    const customContent = (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Disparo por Workflow</span>
        </div>
        {data.workflowId ? (
          <div className="text-xs text-gray-500">Workflow ID: {data.workflowId}</div>
        ) : (
          <div className="text-xs text-gray-500">
            Configure o ID do workflow que irá disparar este nó
          </div>
        )}
      </div>
    )

    return (
      <BaseNode
        data={{
          label: data.label,
          type: data.type,
          description: data.description,
          validation: {
            validateHandlerTarget: false,
            validateHandlerSource: true,
            validateHandlerSourceCount: 1,
          },
          returnAllowed: false,
          customContent,
        }}
        selected={selected}
        {...props}
      />
    )
  },
)
