import { FC, memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from '@/modules/workflow-builder/components/nodes/base/BaseNode'
import { Input } from '@/components/ui/input'
import { useNodeSettings } from '@/modules/workflow-builder/contexts/NodeSettingsContext'
import { ActivityNodeConfig } from '@/modules/workflow-builder/types/node-settings'

export interface ActivityNodeData {
  label: string
  description: string
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

const mechanismLabels = {
  NONE: 'Nenhum (Qualquer pessoa)',
  USER: 'Usuário',
  GROUP: 'Grupo',
  SPECIFIC_GROUP: 'Para um grupo',
}

export const ActivityNode: FC<NodeProps<ActivityNodeData>> = ({ data, selected, ...props }) => {
  const { getNodeSettings } = useNodeSettings()
  const nodeSettings = getNodeSettings<ActivityNodeConfig>(props.id)

  const assignee =
    mechanismLabels[(nodeSettings?.settings.assigneeType as keyof typeof mechanismLabels) || 'NONE']

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
        customContent: (
          <div className="space-y-5 mt-10">
            <div className="flex flex-col gap-2">
              <span>Responsável</span>
              <Input type="text" placeholder="Responsável" disabled value={assignee} />
            </div>
            
          </div>
        ),
      }}
      selected={selected}
      {...props}
    />
  )
}

export default memo(ActivityNode)
