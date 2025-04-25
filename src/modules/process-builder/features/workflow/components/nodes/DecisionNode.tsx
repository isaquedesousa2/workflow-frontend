import { FC } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'
import { useNodeSettings } from '@/modules/process-builder/workflow/contexts/NodeSettingsContext'
import { DecisionNodeConfig } from '@/modules/process-builder/workflow/types/node-settings'

const operatorLabels: Record<string, string> = {
  '>': 'maior que',
  '<': 'menor que',
  '>=': 'maior ou igual a',
  '<=': 'menor ou igual a',
  '==': 'igual a',
  '!=': 'diferente de',
  contains: 'contém',
  startsWith: 'começa com',
  endsWith: 'termina com',
}

export interface DecisionNodeData {
  type: string
  icon: string
  conditions?: {
    id: string
    label: string
    value: string
  }[]
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const DecisionNode: FC<NodeProps<DecisionNodeData>> = (props) => {
  const { getNodeSettings } = useNodeSettings()
  const nodeSettings = getNodeSettings<DecisionNodeConfig>(props.id)

  const getConditionText = () => {
    if (!nodeSettings?.settings) return 'Descreva a condição'

    const { formField, operator, comparisonType, comparisonValue, comparisonField } =
      nodeSettings.settings

    if (!formField?.label || !operator) return 'Descreva a condição'

    const operatorText = operatorLabels[operator] || operator
    const comparisonText = comparisonType === 'value' ? comparisonValue : comparisonField?.label

    return `${formField.label} ${operatorText} ${comparisonText || '...'}`
  }

  return (
    <>
      <BaseNode
        {...props}
        data={{
          ...props.data,
          label: nodeSettings?.settings?.label || '',
          description: nodeSettings?.settings?.description || '',
          validation: {
            validateHandlerTarget: true,
            validateHandlerSource: true,
            validateHandlerTargetCount: 1,
            validateHandlerSourceCount: 2,
          },
          customContent: (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Condição</div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-sm text-gray-500">
                  {getConditionText()}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm text-gray-700">Sim</p>
                </div>

                <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <p className="text-sm text-gray-700">Não</p>
                </div>
              </div>
            </div>
          ),
          customSourceHandlers: [
            {
              id: 'yes',
              type: 'source',
              position: Position.Right,
              style: {
                top: '68%',
              },
            },
            {
              id: 'no',
              type: 'source',
              position: Position.Right,
              style: {
                top: '87%',
              },
            },
          ],
        }}
      />
    </>
  )
}
