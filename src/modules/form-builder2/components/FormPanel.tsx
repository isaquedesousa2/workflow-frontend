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
  Mail,
  Phone,
  Hash,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'

const componentCategories = [
  {
    name: 'Texto',
    icon: <TextCursor className="h-4 w-4" />,
    components: [
      { type: 'title', icon: <TextCursor className="h-4 w-4" />, label: 'Título' },
      { type: 'subtitle', icon: <TextCursor className="h-4 w-4" />, label: 'Subtítulo' },
      { type: 'text', icon: <TextCursor className="h-4 w-4" />, label: 'Texto' },
      { type: 'textarea', icon: <AlignLeft className="h-4 w-4" />, label: 'Texto Longo' },
    ],
  },
  {
    name: 'Entrada',
    icon: <Type className="h-4 w-4" />,
    components: [
      { type: 'email', icon: <Mail className="h-4 w-4" />, label: 'Email' },
      { type: 'phone', icon: <Phone className="h-4 w-4" />, label: 'Telefone' },
      { type: 'number', icon: <Hash className="h-4 w-4" />, label: 'Número' },
      { type: 'date', icon: <Calendar className="h-4 w-4" />, label: 'Data' },
    ],
  },
  {
    name: 'Seleção',
    icon: <ListFilter className="h-4 w-4" />,
    components: [
      { type: 'select', icon: <ListFilter className="h-4 w-4" />, label: 'Selecionar' },
      { type: 'checkbox', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox' },
      {
        type: 'checkbox-group',
        icon: <CheckSquare className="h-4 w-4" />,
        label: 'Checkbox Group',
      },
    ],
  },
  {
    name: 'Ação',
    icon: <MousePointerClick className="h-4 w-4" />,
    components: [
      { type: 'button', icon: <MousePointerClick className="h-4 w-4" />, label: 'Botão' },
      { type: 'heading', icon: <Type className="h-4 w-4" />, label: 'Cabeçalho' },
    ],
  },
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    componentCategories.map((cat) => cat.name),
  )

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName],
    )
  }

  return (
    <div className="space-y-4">
      {componentCategories.map((category) => (
        <div key={category.name} className="border rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleCategory(category.name)}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-muted">{category.icon}</div>
              <span className="font-medium">{category.name}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                expandedCategories.includes(category.name) ? 'rotate-180' : '',
              )}
            />
          </button>
          {expandedCategories.includes(category.name) && (
            <div className="p-3 space-y-1">
              {category.components.map((component) => (
                <DraggableComponent
                  key={component.type}
                  type={component.type as FormComponentType}
                  icon={component.icon}
                  label={component.label}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
