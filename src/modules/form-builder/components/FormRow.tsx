'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormField } from '../types/form.types'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { FormFieldComponent } from './FormFieldComponent'
import { cn } from '@/lib/utils'

interface FormRowProps {
  id: string
  fields: FormField[]
  isDragging?: boolean
}

export const FormRow: React.FC<FormRowProps> = ({ id, fields, isDragging }) => {
  const { addField, removeRow } = useFormBuilder()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: `field-${Date.now()}`,
      type: 'text',
      label: 'Novo Campo',
      placeholder: '',
      validation: {
        required: false,
      },
    }
    addField(id, newField)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-4 border rounded-lg bg-white shadow-sm',
        isDragging && 'opacity-50 shadow-lg scale-105',
      )}
      data-droppable="true"
      id={`row-${id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div {...attributes} {...listeners} className="p-2 cursor-grab hover:bg-gray-100 rounded">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-sm font-medium">Linha {id}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddField}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Campo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeRow(id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <FormFieldComponent key={field.id} field={field} rowId={id} />
        ))}
      </div>
    </div>
  )
}
