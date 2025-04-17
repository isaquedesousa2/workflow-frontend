'use client'
import { memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'

interface EndNodeData {
  label: string
  type: string
  description: string
  onDelete?: (nodeId: string) => void
}

export const EndNode = memo(({ data, selected, ...props }: NodeProps<EndNodeData>) => {
  return (
    <BaseNode
      data={{
        ...data,
        validation: {
          validateHandlerTarget: true,
          validateHandlerSource: false,
          validateHandlerTargetCount: 1,
        },
        returnAllowed: false,
        customSourceHandlers: [],
      }}
      selected={selected}
      {...props}
    />
  )
})
