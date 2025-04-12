import { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

interface ConexaoFluxoProps extends EdgeProps {}

const ConexaoFluxo = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: ConexaoFluxoProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, cursor: 'default' }} />;
};

export default memo(ConexaoFluxo);
