import { memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from '../base/BaseNode'
import { useNodeSettings } from '@/modules/process-builder/workflow/contexts/NodeSettingsContext'
import { Input } from '@/components/ui/input'
import { ManualTriggerNodeConfig } from '@/modules/process-builder/workflow/types/node-settings'

interface ManualTriggerNodeData {
  label: string
  type: string
  description: string
  onDelete?: (nodeId: string) => void
}

const mechanismLabels = {
  NONE: 'Nenhum (Qualquer pessoa)',
  USER: 'Usuário',
  GROUP: 'Grupo',
  SPECIFIC_GROUP: 'Para um grupo',
}

export const ManualTriggerNode = memo(
  ({ data, selected, ...props }: NodeProps<ManualTriggerNodeData>) => {
    const { getNodeSettings } = useNodeSettings()
    const nodeSettings = getNodeSettings<ManualTriggerNodeConfig>(props.id)

    const assignee =
      mechanismLabels[nodeSettings?.settings.mechanism as keyof typeof mechanismLabels]

    return (
      <BaseNode
        data={{
          ...data,
          label: nodeSettings?.settings?.label || data.label,
          description: nodeSettings?.settings?.description || data.description,
          validation: {
            validateHandlerTarget: false,
            validateHandlerSource: true,
            validateHandlerSourceCount: 1,
          },
          returnAllowed: false,
          showLeftHandle: false,
          customContent: (
            <div className="space-y-5 mt-10">
              <div className="flex flex-col gap-2">
                <span>Responsável</span>
                <Input type="text" placeholder="Responsável" disabled value={assignee} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Disparo manual</span>
                </div>
              </div>
            </div>
          ),
        }}
        selected={selected}
        {...props}
      />
    )
  },
)
