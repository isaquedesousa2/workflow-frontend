'use client'

import React from 'react'
import { FormField as FormFieldType } from '../types/form.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Grip, Settings, Trash2 } from 'lucide-react'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  field: FormFieldType
  onRemove: () => void
}

export const FormField: React.FC<FormFieldProps> = ({ field, onRemove }) => {
  const { selectField } = useFormBuilder()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
        return (
          <input
            type={field.type}
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
            placeholder={field.placeholder}
            disabled
          />
        )
      case 'textarea':
        return (
          <textarea
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
            placeholder={field.placeholder}
            disabled
          />
        )
      case 'select':
        return (
          <select className="w-full px-3 py-2 border rounded-md bg-gray-50" disabled>
            <option>Selecione uma opção</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input type={field.type} disabled />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )
      case 'zoom':
        return (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Buscar..."
              disabled
            />
            <Button variant="outline" size="sm" disabled>
              Zoom
            </Button>
          </div>
        )
      case 'dataset':
        return (
          <select className="w-full px-3 py-2 border rounded-md bg-gray-50" disabled>
            <option>Carregar do dataset...</option>
          </select>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border rounded-lg p-4 bg-white shadow-sm transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg scale-105',
        'hover:shadow-md',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-move hover:bg-gray-100 p-1 rounded">
            <Grip className="w-5 h-5 text-gray-400" />
          </div>
          <label className="text-sm font-medium">{field.label}</label>
          {field.validation?.required && <span className="text-red-500">*</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => selectField(field)}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {renderFieldPreview()}

      {field.validation?.readonly && (
        <div className="mt-1">
          <span className="text-xs text-gray-500">Campo somente leitura</span>
        </div>
      )}
    </div>
  )
}
