import { FC } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'
import { DecisionNodeConfig } from '../../types/node-settings'
import { Position } from '@xyflow/react'
import { useNodeConfig } from '@/modules/process-builder/features/workflow/contexts/NodeConfigContext'

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
  const { getNodeConfig } = useNodeConfig()
  const nodeConfig = getNodeConfig<DecisionNodeConfig>(props.id)

  return (
    <>
      <BaseNode
        {...props}
        data={{
          ...props.data,
          label: nodeConfig?.label || '',
          description: nodeConfig?.description || '',
          validation: {
            validateHandlerTarget: true,
            validateHandlerSource: true,
            validateHandlerTargetCount: 1,
            validateHandlerSourceCount: 2,
          },
          customContent: (
            <div className="space-y-4">
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
