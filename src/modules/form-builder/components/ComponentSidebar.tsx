'use client'

import React from 'react'
import { FormField, FieldType } from '../types/form.types'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  TextIcon,
  MailIcon,
  HashIcon,
  AlignJustifyIcon,
  ListIcon,
  CheckSquareIcon,
  CircleIcon,
  CalendarIcon,
  SearchIcon,
  DatabaseIcon,
  TableIcon,
  FileIcon,
  EyeOffIcon,
} from 'lucide-react'

interface DraggableComponentProps {
  type: FieldType
  label: string
  icon: React.FC<{ className?: string }>
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, label, icon: Icon }) => {
  const onDragStart = (event: React.DragEvent) => {
    const field: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `Novo Campo ${type}`,
      name: `field_${Date.now()}`,
    }

    event.dataTransfer.setData('application/form-field', JSON.stringify(field))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className={cn(
        'p-3 cursor-move transition-all duration-200',
        'hover:bg-gray-50 hover:shadow-sm',
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
    </Card>
  )
}

const fieldTypes = [
  { type: 'text', label: 'Texto', icon: TextIcon },
  { type: 'email', label: 'Email', icon: MailIcon },
  { type: 'number', label: 'Número', icon: HashIcon },
  { type: 'textarea', label: 'Área de Texto', icon: AlignJustifyIcon },
  { type: 'select', label: 'Seleção', icon: ListIcon },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquareIcon },
  { type: 'radio', label: 'Radio', icon: CircleIcon },
  { type: 'date', label: 'Data', icon: CalendarIcon },
  { type: 'zoom', label: 'Zoom', icon: SearchIcon },
  { type: 'dataset', label: 'Dataset', icon: DatabaseIcon },
  { type: 'table', label: 'Tabela', icon: TableIcon },
  { type: 'file', label: 'Arquivo', icon: FileIcon },
  { type: 'hidden', label: 'Campo Oculto', icon: EyeOffIcon },
] as const

export const ComponentSidebar: React.FC = () => {
  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Componentes</h2>
      <div className="space-y-2">
        {fieldTypes.map(({ type, label, icon }) => (
          <DraggableComponent key={type} type={type} label={label} icon={icon} />
        ))}
      </div>
    </div>
  )
}
