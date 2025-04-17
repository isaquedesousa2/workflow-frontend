import { FC, memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from '@/modules/workflow-builder/components/nodes/base/BaseNode'

export interface ActivityNodeData {
  label: string
  description: string
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const ActivityNode: FC<NodeProps<ActivityNodeData>> = ({ data, selected, ...props }) => {
  return (
    <BaseNode
      data={{
        label: data.label,
        description: data.description,
        type: 'activity',
        returnAllowed: true,
        validation: {
          validateHandlerTarget: true,
          validateHandlerSource: true,
        },
        onDelete: data.onDelete,
        onSettings: data.onSettings,
      }}
      selected={selected}
      {...props}
    />
  )
}

export default memo(ActivityNode)
