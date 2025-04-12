import { memo, useState } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';
import { X, Plus } from 'lucide-react';

const WorkflowConnection = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    id,
    source,
    target,
}: EdgeProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    const edgeStyle = {
        ...style,
        stroke: isHovered ? '#6d28d9' : style.stroke,
        transition: 'stroke 0.2s ease-in-out',
    };

    return (
        <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
            <path d={edgePath} fill="none" stroke="transparent" strokeWidth={40} style={{ cursor: 'default' }} />
            {isHovered && (
                <foreignObject x={centerX - 28} y={centerY - 12} width={56} height={24} style={{ overflow: 'visible' }}>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                const event = new CustomEvent('deleteEdge', { detail: { edgeId: id } });
                                window.dispatchEvent(event);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={() => {
                                const event = new CustomEvent('addNodeBetween', {
                                    detail: {
                                        sourceId: source,
                                        targetId: target,
                                    },
                                });
                                window.dispatchEvent(event);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </foreignObject>
            )}
        </g>
    );
};

export default memo(WorkflowConnection);
