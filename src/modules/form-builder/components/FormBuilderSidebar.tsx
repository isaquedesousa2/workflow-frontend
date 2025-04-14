'use client'

import type React from 'react'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FieldType } from '../types/form-builder'

interface FieldItemProps {
  type: FieldType
  label: string
  icon: React.ReactNode
}

function FieldItem({ type, label, icon }: FieldItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `new-${type}`,
    data: {
      type: 'FIELD',
      fieldType: type,
      label,
      isNew: true,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-move">
      <Card className="mb-2 hover:border-gray-400 transition-colors">
        <CardContent className="p-3 flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </CardContent>
      </Card>
    </div>
  )
}

export function FormBuilderSidebar() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-72 border-r bg-white flex flex-col h-full">
      <div className="px-4 py-2 flex flex-col gap-5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar propriedades e campos"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FieldItem
          type="textarea"
          label="Textarea"
          icon={
            <div className="w-6 h-6 flex items-center justify-center border rounded text-xs">¶</div>
          }
        />
      </div>
    </div>
  )
}
