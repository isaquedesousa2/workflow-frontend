import { memo } from 'react'
import { NodeProps } from 'reactflow'
import { BaseNode } from './base/BaseNode'

interface JoinNodeData {
  label: string
  type: string
  icon: string
  description: string
  onDelete?: (nodeId: string) => void
  onSettings?: (nodeId: string) => void
}

export const JoinNode = memo(({ data, selected, ...props }: NodeProps<JoinNodeData>) => {
  return (
    <BaseNode
      data={{
        label: data.label,
        type: data.type,
        description: data.description,
        onDelete: data.onDelete,
        onSettings: data.onSettings,
        validation: {
          validateHandlerTarget: true,
          validateHandlerTargetCount: 2,
          validateHandlerSource: true,
        },
      }}
      selected={selected}
      {...props}
    />
    // <div
    //   className={`bg-white rounded-sm p-4 min-w-[400px] shadow-lg transition-all duration-200 ring-1 ring-purple-300 ${
    //     selected ? 'ring-2 ring-purple-500' : ''
    //   }`}
    // >
    //   <Handle
    //     type="target"
    //     position={Position.Left}
    //     className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
    //     style={{ left: -8, width: '16px', height: '16px', top: '50%' }}
    //   />

    //   <div className="flex items-center justify-between mb-2">
    //     <div className="flex items-center gap-2">
    //       <CheckCircle2 className="w-5 h-5 text-green-500" />
    //       <span className="font-medium text-gray-900">{data.label}</span>
    //     </div>
    //     <div className="flex items-center gap-1">
    //       <button
    //         // onClick={() => data.onSettings?.(data.id)}
    //         className="p-1 hover:bg-gray-100 rounded-md transition-colors"
    //       >
    //         <Settings2 className="w-4 h-4 text-gray-500" />
    //       </button>
    //       <button
    //         // onClick={() => data.onDelete?.(data.id)}
    //         className="p-1 hover:bg-gray-100 rounded-md transition-colors"
    //       >
    //         <Trash2 className="w-4 h-4 text-gray-500" />
    //       </button>
    //     </div>
    //   </div>

    //   <div className="space-y-2">
    //     <div className="text-sm text-gray-500">{data.description}</div>
    //     <div className="flex items-center gap-2 text-sm text-gray-500">
    //       <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">{data.type}</span>
    //     </div>
    //   </div>

    //   <Handle
    //     type="source"
    //     position={Position.Right}
    //     className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
    //     style={{ right: -8, width: '16px', height: '16px', top: '50%' }}
    //   />
    // </div>
  )
})

JoinNode.displayName = 'JoinNode'
