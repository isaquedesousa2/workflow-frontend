'use client'
import React, { useState } from 'react'
import { DndContext, DragOverlay, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { SortableItem } from '@/components/SortableItem'
import { Item } from '@/components/Item'

export default function TestePage() {
  const [items, setItems] = useState(['1', '2', '3'])
  const [activeId, setActiveId] = useState<string | null>(null)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  return (
    <div className="p-8">
      <DndContext
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <SortableContext items={items}>
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </div>
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
