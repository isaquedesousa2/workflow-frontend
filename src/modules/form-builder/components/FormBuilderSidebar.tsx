'use client'

import type React from 'react'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Search, Text, Mail, Phone, Calendar, CheckSquare, Radio, List, MapPin } from 'lucide-react'
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

  const fieldTypes: FieldItemProps[] = [
    {
      type: 'text',
      label: 'Texto',
      icon: <Text className="h-4 w-4" />,
    },
    {
      type: 'email',
      label: 'Email',
      icon: <Mail className="h-4 w-4" />,
    },
    {
      type: 'phone',
      label: 'Telefone',
      icon: <Phone className="h-4 w-4" />,
    },
    {
      type: 'textarea',
      label: 'Textarea',
      icon: <Text className="h-4 w-4" />,
    },
    {
      type: 'date',
      label: 'Data',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      type: 'checkbox',
      label: 'Checkbox',
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      type: 'radio',
      label: 'Radio',
      icon: <Radio className="h-4 w-4" />,
    },
    {
      type: 'select',
      label: 'Select',
      icon: <List className="h-4 w-4" />,
    },
    {
      type: 'address',
      label: 'Endereço',
      icon: <MapPin className="h-4 w-4" />,
    },
  ]

  const filteredFields = fieldTypes.filter((field) =>
    field.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-72 border-r bg-white flex flex-col h-full">
      <div className="px-4 py-2 flex flex-col gap-5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar campos"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="campos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campos">Campos</TabsTrigger>
            <TabsTrigger value="propriedades">Propriedades</TabsTrigger>
          </TabsList>
          <TabsContent value="campos" className="mt-4">
            <div className="space-y-2">
              {filteredFields.map((field) => (
                <FieldItem key={field.type} {...field} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="propriedades">
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Selecione um campo para editar suas propriedades
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
