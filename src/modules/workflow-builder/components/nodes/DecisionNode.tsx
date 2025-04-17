import { FC } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'

export interface DecisionNodeData {
  label: string
  type: string
  icon: string
  description: string
  conditions?: {
    id: string
    label: string
    value: string
  }[]
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const DecisionNode: FC<NodeProps<DecisionNodeData>> = (props) => {
  const condition = props.data.conditions?.[0]?.label || ''

  return (
    <>
      <BaseNode
        {...props}
        data={{
          ...props.data,
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
                  {condition || 'Descreva a condição'}
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
