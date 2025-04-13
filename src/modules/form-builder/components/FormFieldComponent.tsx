'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormField } from '../types/form.types'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { Button } from '@/components/ui/button'
import { GripVertical, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormFieldComponentProps {
  field: FormField
  rowId: string
}

export const FormFieldComponent: React.FC<FormFieldComponentProps> = ({ field, rowId }) => {
  const { updateField, removeField } = useFormBuilder()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleChange = (key: keyof FormField, value: any) => {
    updateField(rowId, {
      ...field,
      [key]: value,
    })
  }

  const handleValidationChange = (key: keyof FormField['validation'], value: any) => {
    updateField(rowId, {
      ...field,
      validation: {
        ...field.validation,
        [key]: value,
      },
    })
  }

  return (
    <div ref={setNodeRef} style={style} className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div {...attributes} {...listeners} className="p-2 cursor-grab hover:bg-gray-100 rounded">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-sm font-medium">{field.label || 'Campo'}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeField(rowId, field.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`label-${field.id}`}>Rótulo</Label>
          <Input
            id={`label-${field.id}`}
            value={field.label}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`type-${field.id}`}>Tipo</Label>
          <Select
            value={field.type}
            onValueChange={(value) => handleChange('type', value as FormField['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="tel">Telefone</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="select">Seleção</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="textarea">Área de Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
          <Input
            id={`placeholder-${field.id}`}
            value={field.placeholder}
            onChange={(e) => handleChange('placeholder', e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.validation?.required}
            onChange={(e) => handleValidationChange('required', e.target.checked)}
          />
          <Label htmlFor={`required-${field.id}`}>Campo Obrigatório</Label>
        </div>
      </div>
    </div>
  )
}
