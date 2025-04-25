'use client'

import type React from 'react'

import { useDraggable } from '@dnd-kit/core'
import type { FormComponentType } from '../types'
import {
  AlignLeft,
  CheckSquare,
  ListFilter,
  MousePointerClick,
  TextCursor,
  Type,
  Mail,
  Phone,
  Hash,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const components = [
  { type: 'title', icon: <TextCursor className="h-4 w-4" />, label: 'Título' },
  { type: 'subtitle', icon: <TextCursor className="h-4 w-4" />, label: 'Subtítulo' },
  { type: 'text', icon: <TextCursor className="h-4 w-4" />, label: 'Texto' },
  { type: 'textarea', icon: <AlignLeft className="h-4 w-4" />, label: 'Texto Longo' },
  { type: 'email', icon: <Mail className="h-4 w-4" />, label: 'Email' },
  { type: 'phone', icon: <Phone className="h-4 w-4" />, label: 'Telefone' },
  { type: 'number', icon: <Hash className="h-4 w-4" />, label: 'Número' },
  { type: 'datepicker', icon: <Calendar className="h-4 w-4" />, label: 'Data' },
  { type: 'select', icon: <ListFilter className="h-4 w-4" />, label: 'Selecionar' },
  { type: 'checkbox', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox' },
  { type: 'checkbox-group', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox Group' },
  { type: 'button', icon: <MousePointerClick className="h-4 w-4" />, label: 'Botão' },
  { type: 'heading', icon: <Type className="h-4 w-4" />, label: 'Cabeçalho' },
]

interface DraggableComponentProps {
  type: FormComponentType
  icon: React.ReactNode
  label: string
}

function DraggableComponent({ type, icon, label }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      type: 'component-panel',
      componentType: type,
    },
  })

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'flex items-center gap-2 p-3 mb-2 border rounded-md cursor-grab bg-white hover:bg-gray-50 transition-all',
        isDragging ? 'opacity-30 scale-95' : 'hover:shadow-sm hover:-translate-y-0.5',
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-describedby={`component-${type}-description`}
    >
      <div className={`p-1.5 rounded-md ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>{icon}</div>
      <span>{label}</span>
      <span id={`component-${type}-description`} className="sr-only">
        Arraste para adicionar um componente do tipo {label}
      </span>
    </motion.div>
  )
}

export function FormComponentPanel() {
  return (
    <div className="p-4 space-y-2">
      {components.map((component) => (
        <DraggableComponent
          key={component.type}
          type={component.type as FormComponentType}
          icon={component.icon}
          label={component.label}
        />
      ))}
    </div>
  )
}
