import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
    label: string;
    type: string;
    icon?: string;
    description?: string;
    onDelete?: (id: string) => void;
}

type NodeType = 'Início' | 'Condição' | 'Ação' | 'Fim' | string;

const getNodeStyles = (type: NodeType): { iconBg: string; iconColor: string } => {
    switch (type) {
        case 'Início':
            return {
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-600',
            };
        case 'Fim':
            return {
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
            };
        default:
            return {
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-600',
            };
    }
};

export const CustomNode: FC<NodeProps<CustomNodeData>> = memo(({ data, id, selected }) => {
    const { iconBg, iconColor } = getNodeStyles(data.type);
    const icon = data.icon || '⚡';

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    const isDeletable = data.type !== 'Início' && data.type !== 'Fim';

    return (
        <div className={`bg-white rounded shadow-lg min-w-[200px] max-w-[300px] ring-1 ring-purple-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
            {data.type !== 'Início' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
                    style={{ left: -8, width: '16px', height: '16px' }}
                />
            )}

            <div className="p-3">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center ${iconBg} ${iconColor} rounded`}>
                        <span className="text-lg">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-700 truncate">{data.label}</p>
                            {isDeletable && (
                                <button
                                    onClick={handleDelete}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 cursor-pointer flex-shrink-0"
                                    title="Excluir nó"
                                    aria-label="Excluir nó"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {data.description && <p className="text-sm text-gray-500 mt-0.5 break-words whitespace-pre-wrap">{data.description}</p>}
                    </div>
                </div>
            </div>

            {data.type !== 'Fim' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
                    style={{ right: -8, width: '16px', height: '16px' }}
                />
            )}
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
