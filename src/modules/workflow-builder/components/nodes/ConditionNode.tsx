import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ConditionNodeData {
    label: string;
    type: string;
    icon: string;
    description: string;
    conditions: {
        id: string;
        label: string;
        value: string;
    }[];
    onDelete?: (nodeId: string) => void;
}

const getNodeStyles = (): { iconBg: string; iconColor: string } => {
    return {
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
    };
};

const ConditionNode: FC<NodeProps<ConditionNodeData>> = ({ data, selected, id }) => {
    const { iconBg, iconColor } = getNodeStyles();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    return (
        <div className={`bg-white rounded shadow-lg min-w-[200px] max-w-[300px] ring-1 ring-purple-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
                style={{ left: -9, width: '16px', height: '16px' }}
            />

            <div className="p-3">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center ${iconBg} ${iconColor} rounded`}>
                        <span className="text-lg">{data.icon}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-700">{data.label}</p>
                            <button
                                onClick={handleDelete}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 cursor-pointer"
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
                        </div>
                        {data.description && <p className="text-sm text-gray-500 mt-0.5">{data.description}</p>}
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    {data.conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center gap-2 relative">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={condition.label}
                                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    readOnly
                                />
                            </div>
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={condition.id}
                                className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
                                style={{
                                    right: -8,
                                    width: '16px',
                                    height: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ConditionNode);
