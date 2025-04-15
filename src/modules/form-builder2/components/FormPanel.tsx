'use client'

import type React from 'react'

import { useDraggable } from '@dnd-kit/core'
import type { FormComponentType } from '../types'
import {
  AlignLeft,
  CheckSquare,
  ListFilter,
  MousePointerClick,
  Square,
  TextCursor,
  Type,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const componentTypes: { type: FormComponentType; icon: React.ReactNode; label: string }[] = [
  { type: 'text', icon: <TextCursor className="h-4 w-4" />, label: 'Text Input' },
  { type: 'textarea', icon: <AlignLeft className="h-4 w-4" />, label: 'Text Area' },
  { type: 'select', icon: <ListFilter className="h-4 w-4" />, label: 'Select' },
  { type: 'checkbox', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox' },
  { type: 'radio', icon: <Square className="h-4 w-4" />, label: 'Radio' },
  { type: 'button', icon: <MousePointerClick className="h-4 w-4" />, label: 'Button' },
  { type: 'heading', icon: <Type className="h-4 w-4" />, label: 'Heading' },
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
    <div className="space-y-1">
      {componentTypes.map((component) => (
        <DraggableComponent
          key={component.type}
          type={component.type}
          icon={component.icon}
          label={component.label}
        />
      ))}
    </div>
  )
}
