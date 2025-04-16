'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FormComponent } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Settings } from 'lucide-react'
import { useState } from 'react'
import { ComponentSettings } from './FormSettings'
import { getColumnClass } from '../utils'
import { motion, AnimatePresence } from 'framer-motion'

interface SortableFormComponentProps {
  rowId: string
  component: FormComponent
  componentIndex: number
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<FormComponent>) => void
  maxColumnSpan: number
  dropIndicator: {
    isVisible: boolean
    rowIndex: number
    componentIndex: number
  }
}

export function SortableFormComponent({
  rowId,
  component,
  componentIndex,
  onRemove,
  onUpdate,
  dropIndicator,
}: SortableFormComponentProps) {
  const [showSettings, setShowSettings] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: {
      type: 'component-sortable',
      rowId: rowId,
      columnIndex: componentIndex,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative ${getColumnClass(component.columnSpan)} ${
        isDragging ? 'z-10 opacity-50 scale-105 shadow-xl' : ''
      } ${
        dropIndicator.isVisible && dropIndicator.componentIndex === componentIndex
          ? 'border-2 border-dashed border-purple-500'
          : ''
      } transition-all duration-200`}
    >
      <motion.div
        className="absolute -top-2 -left-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-md shadow-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isDragging ? 1 : 0, scale: isDragging ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      >
        Movendo
      </motion.div>

      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-muted transition-colors"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <CardContent className="p-4 pl-10">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">{component.label || component.type}</Label>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={`h-8 w-8 ${showSettings ? 'bg-muted' : ''}`}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(component.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>

        {showSettings && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ComponentSettings
                component={component}
                onUpdate={(updates) => onUpdate(component.id, updates)}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
