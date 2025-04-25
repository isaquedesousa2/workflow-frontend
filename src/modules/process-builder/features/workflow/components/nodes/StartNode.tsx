import { memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'

interface StartNodeData {
  label: string
  type: string
  description: string
  onDelete?: (nodeId: string) => void
}

export const StartNode = memo(({ data, selected, ...props }: NodeProps<StartNodeData>) => {
  return (
    <BaseNode
      data={{
        ...data,
        validation: {
          validateHandlerTarget: false,
          validateHandlerSource: true,
          validateHandlerSourceCount: 1,
        },
        returnAllowed: false,
        showLeftHandle: false,
      }}
      selected={selected}
      {...props}
    />
  )
})
