import { EdgeProps } from 'reactflow'
import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { MousePointerClick } from 'lucide-react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow'

export const WorkflowConnectionAddNode = memo((props: EdgeProps) => {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeStyle = {
    stroke: '#6d28d9',
    transition: 'stroke 0.2s ease-in-out',
  }

  const onEdgeClick = () => {
    const event = new CustomEvent('addNodeBetween', {
      detail: {
        sourceId: props.source,
        targetId: props.target,
      },
    })
    window.dispatchEvent(event)
  }

  return (
    <>
      <BaseEdge path={edgePath} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button onClick={onEdgeClick} size="icon" variant="secondary">
            <MousePointerClick size={16} />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
})
