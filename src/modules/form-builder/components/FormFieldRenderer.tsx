'use client'

import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import type { FormField, FieldOption } from '../types/form.types'
import { TextInput } from './inputs/TextInput'
import { SelectInput } from './inputs/SelectInput'
import { DateInput } from './inputs/DateInput'
import { AddressInput } from './inputs/AddressInput'

interface FieldRendererProps {
  field: FormField
  rowId: string
  columnId: string
  isPreview?: boolean
}

const defaultOptions: FieldOption[] = [
  { label: 'Opção 1', value: 'opcao1' },
  { label: 'Opção 2', value: 'opcao2' },
  { label: 'Opção 3', value: 'opcao3' },
]

export function FormFieldRenderer({
  field,
  rowId,
  columnId,
  isPreview = false,
}: FieldRendererProps) {
  const { removeField, setActiveField, activeField } = useFormBuilder() as any
  const isActive = activeField === field.id

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
    data: {
      type: 'FIELD',
      fieldId: field.id,
      rowId,
      columnId,
    },
    disabled: isPreview,
  })

  const style =
    transform && !isPreview
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          zIndex: 1000,
        }
      : undefined

  const renderFieldInput = () => {
    if (!isPreview) {
      return (
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Preview do campo</p>
        </div>
      )
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'textarea':
        return <TextInput field={field} />
      case 'date':
        return <DateInput field={field} />
      case 'select':
      case 'radio':
      case 'checkbox':
        return <SelectInput field={field} />
      case 'address':
        return <AddressInput field={field} />
      default:
        return <TextInput field={field} />
    }
  }

  const handleRemoveField = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Tentando remover campo:', field.id) // Para debug
    removeField(field.id)
  }

  if (isPreview) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          {field.validation?.required && <span className="text-red-500">*</span>}
        </div>
        {renderFieldInput()}
        {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...(isPreview ? {} : { ...listeners, ...attributes })}>
      <Card
        className={`border-gray-300 hover:border-gray-400 transition-colors ${
          isActive ? 'border-blue-500 ring-2 ring-blue-200' : ''
        }`}
      >
        <CardHeader className="p-2 border-b bg-gray-50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="cursor-grab h-7 w-7">
              <GripVertical className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{field.label}</span>
            {field.validation?.required && <span className="text-red-500 text-xs">*</span>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setActiveField(isActive ? null : field.id)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-red-500"
              onClick={handleRemoveField}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">{renderFieldInput()}</CardContent>
      </Card>
    </div>
  )
}
