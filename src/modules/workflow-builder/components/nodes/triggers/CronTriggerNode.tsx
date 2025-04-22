import { memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from '../base/BaseNode'

interface CronTriggerNodeData {
  label: string
  type: string
  description: string
  schedule: string
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const CronTriggerNode = memo(
  ({ data, selected, ...props }: NodeProps<CronTriggerNodeData>) => {
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
          customContent: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Agendamento</span>
              </div>
              <div className="text-sm text-gray-500">
                Este nó inicia o workflow automaticamente de acordo com o agendamento configurado.
              </div>
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <div className="text-xs font-medium text-blue-700">
                  Cron: {data.schedule || 'Não configurado'}
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
