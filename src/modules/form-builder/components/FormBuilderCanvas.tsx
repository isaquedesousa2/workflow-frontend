'use client'

import React from 'react'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { FormField, FormRow } from '../types/form.types'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FormRow as FormRowComponent } from './FormRow'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const FormBuilderCanvas: React.FC = () => {
  const { layout, addRow, reorderRows, addField } = useFormBuilder()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = layout.rows.findIndex((r) => r.id === active.id)
    const newIndex = layout.rows.findIndex((r) => r.id === over.id)

    reorderRows(oldIndex, newIndex)
    setActiveId(null)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()

    const fieldData = event.dataTransfer.getData('application/form-field')
    if (!fieldData) return

    const field = JSON.parse(fieldData) as FormField
    const target = event.target as HTMLElement
    const dropZone = target.closest('[data-droppable]')

    if (!dropZone) return

    const rowId = dropZone.id.replace('row-', '')

    addField(rowId, field)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleAddRow = () => {
    const newRow: FormRow = {
      id: `row-${Date.now()}`,
      fields: [],
      cols: 1,
    }
    addRow(newRow)
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Layout do Formulário</h2>
          <Button onClick={handleAddRow} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Linha
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={layout.rows.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4" onDragOver={handleDragOver} onDrop={handleDrop}>
              {layout.rows.map((row) => (
                <FormRowComponent
                  key={row.id}
                  id={row.id}
                  fields={row.fields}
                  isDragging={activeId === row.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {layout.rows.length === 0 && (
          <div
            className="text-center py-12 bg-white rounded-lg border-2 border-dashed"
            data-droppable="true"
            id="empty-canvas"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-gray-500">Arraste componentes aqui ou adicione uma nova linha</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormBuilderCanvas
