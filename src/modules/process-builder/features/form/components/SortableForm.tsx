'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FormComponent } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { ComponentSettings } from './FormSettings'
import { getColumnClass } from '../utils'
import { motion } from 'framer-motion'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'

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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({
      id: component.id,
      data: {
        type: 'component-sortable',
        rowId: rowId,
        columnIndex: componentIndex,
      },
    })

  const style = {
    // transform: CSS.Transform.toString(transform),
    // transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isOver && !isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-500 rounded-sm" />
      )}
      <Card
        className={`${getColumnClass(component.columnSpan)} ${
          isDragging ? 'z-10 shadow-xl' : ''
        } transition-all duration-200`}
      >
        <motion.div
          className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-sm shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isDragging ? 1 : 0, scale: isDragging ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          Movendo
        </motion.div>

        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 rounded-sm hover:bg-muted transition-colors"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <CardContent className="p-4 pl-10">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">{component.label || component.type}</Label>
            <div className="flex gap-1">
              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[calc(100vh-16px)] w-[400px] m-2 mr-0 rounded-sm rounded-r-none">
                  <div className="flex items-center justify-between p-4 border-b">
                    <DrawerTitle>Configurações do Componente</DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fechar</span>
                      </Button>
                    </DrawerClose>
                  </div>
                  <div className="p-4 overflow-y-auto h-[calc(100%-73px)]">
                    <ComponentSettings
                      component={component}
                      onUpdate={(updates) => onUpdate(component.id, updates)}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
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
        </CardContent>
      </Card>
    </div>
  )
}
