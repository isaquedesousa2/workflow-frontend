import { FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export interface ConditionNodeData {
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

export const ConditionNode: FC<NodeProps<ConditionNodeData>> = ({ data, selected, id }) => {
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
                            {data.onDelete && (
                                <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{data.description}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {data.conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <p className="text-sm text-gray-600">{condition.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {data.conditions.map((condition, index) => (
                <Handle
                    key={condition.id}
                    type="source"
                    position={Position.Right}
                    id={condition.id}
                    className="w-10 h-10 !bg-purple-500 border-2 border-white hover:!bg-purple-600 transition-colors"
                    style={{
                        right: -9,
                        width: '16px',
                        height: '16px',
                        top: `${((index + 1) / (data.conditions.length + 1)) * 100}%`,
                    }}
                />
            ))}
        </div>
    );
};
