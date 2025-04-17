import { memo } from 'react'
import { NodeProps, HandleProps, Position } from 'reactflow'
import { BaseNode } from './base/BaseNode'

interface ConditionNodeData {
  label: string
  type: string
  icon: string
  description: string
  conditions: {
    id: string
    label: string
    value: string
  }[]
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const ConditionNode = memo(({ data, selected, ...props }: NodeProps<ConditionNodeData>) => {
  const customContent = (
    <div className="space-y-3">
      {data.conditions.map((condition, index) => (
        <div
          key={`condition-${condition.id}-${index}`}
          className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg"
        >
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <p className="text-sm text-gray-700">{condition.label}</p>
        </div>
      ))}
    </div>
  )

  return (
    <BaseNode
      data={{
        ...data,
        validation: {
          validateHandlerTarget: true,
          validateHandlerSource: true,
          validateHandlerTargetCount: 1,
          validateHandlerSourceCount: data.conditions.length,
        },
        returnAllowed: false,
        customSourceHandlers: [
          {
            type: 'source',
            position: Position.Right,
            style: {
              top: '43%',
            },
          },
          {
            type: 'source',
            position: Position.Right,
            style: {
              top: '63%',
            },
          },
          {
            type: 'source',
            id: props.id, 
            position: Position.Right,
            style: {
              top: '84%',
            },
          },
        ],
        customContent,
      }}
      selected={selected}
      {...props}
    />
  )
})
