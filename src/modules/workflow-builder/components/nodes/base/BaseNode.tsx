import { memo } from 'react'
import { Handle, Position, NodeProps, HandleProps } from 'reactflow'
import { ArrowLeftRight, CheckCircle2, CircleX, Settings2, Trash2, Waypoints } from 'lucide-react'
import { useNodeConnections } from '@xyflow/react'
import { useWorkflowBuilder } from '@/modules/workflow-builder/contexts/WorkflowBuilderContext'
import { cn } from '@/lib/utils'

interface BaseNodeData {
  label: string
  type: string
  description: string
  validation?: {
    validateHandlerTarget?: boolean
    validateHandlerSource?: boolean
    validateHandlerTargetCount?: number
    validateHandlerSourceCount?: number
  }
  returnAllowed?: boolean
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
  customContent?: React.ReactNode
  customSourceHandlers?: (HandleProps & { style?: React.CSSProperties })[]
  showLeftHandle?: boolean
}

export const BaseNode = memo(({ data, selected, ...props }: NodeProps<BaseNodeData>) => {
  const { edges } = useWorkflowBuilder()
  const connections = useNodeConnections({
    id: props.id,
    handleType: 'target',
  })

  const targetConnections = edges.filter((edge) => edge.target === props.id)
  const hasTargetConnections =
    targetConnections.length >= (data.validation?.validateHandlerTargetCount ?? 1)
  const isValidTarget = !data.validation?.validateHandlerTarget || hasTargetConnections

  const sourceConnections = edges.filter((edge) => edge.source === props.id)
  const hasSourceConnections =
    sourceConnections.length >= (data.validation?.validateHandlerSourceCount ?? 1)
  const isValidSource = !data.validation?.validateHandlerSource || hasSourceConnections

  return (
    <div
      className={`bg-white rounded-sm p-4 w-[400px] shadow-lg transition-all duration-200 ring-1 ring-purple-300 ${
        selected ? 'ring-2 ring-purple-500' : ''
      } ${data.validation?.validateHandlerTarget && !isValidTarget ? 'ring-2 ring-red-500' : ''} ${
        data.validation?.validateHandlerSource && !isValidSource ? 'ring-2 ring-red-500' : ''
      }`}
    >
      {data.showLeftHandle !== false && (
        <Handle
          type="target"
          position={Position.Left}
          className={cn(
            'w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors',
            data.validation?.validateHandlerTarget && !isValidTarget ? 'ring-2 ring-red-500' : '',
          )}
          style={{ left: -8, width: '16px', height: '16px', top: '50%' }}
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isValidTarget && isValidSource ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <CircleX className="w-5 h-5 text-red-500" />
          )}

          <span className="font-medium text-gray-900">{data.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 bg-green-500 rounded-full px-2 py-1">
            <Waypoints className="w-4 h-4 text-white" />
            <span className="text-sm text-white">{targetConnections.length}</span>
          </div>

          {data.onSettings && (
            <button
              onClick={() => data.onSettings?.(props.id)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings2 className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {data.onDelete && (
            <button
              onClick={() => data.onDelete?.(props.id)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500 break-words whitespace-pre-wrap line-clamp-4">
          {data.description}
        </p>
        {data.returnAllowed && (
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-gray-500" />
          </div>
        )}
        {data.customContent}
      </div>
      {data.customSourceHandlers ? (
        data.customSourceHandlers.map((handler, index) => (
          <Handle
            key={`${handler.id}-${index}`}
            {...handler}
            className={cn(
              'w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors',
              data.validation?.validateHandlerSource && !isValidSource ? 'ring-2 ring-red-500' : '',
            )}
            style={{ right: -8, width: '16px', height: '16px', top: handler.style?.top }}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className={cn(
            'w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors',
            data.validation?.validateHandlerSource && !isValidSource ? 'ring-2 ring-red-500' : '',
          )}
          style={{ right: -8, width: '16px', height: '16px', top: '50%' }}
        />
      )}
    </div>
  )
})
