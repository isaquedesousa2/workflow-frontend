'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Item } from './Item'

interface SortableItemProps {
  id: string
}

export function SortableItem({ id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({
      id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="relative">
        {isOver && !isDragging && (
          <div className="absolute inset-0 bg-blue-100 border-2 border-blue-500 rounded-lg" />
        )}
        <Item id={id} />
      </div>
    </div>
  )
}
