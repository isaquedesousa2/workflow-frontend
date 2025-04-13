'use client'

import React from 'react'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { FormField } from '../types/form.types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const FieldProperties: React.FC = () => {
  const { selectedField, updateField, selectedSection, selectedRow } = useFormBuilder()

  if (!selectedField || !selectedSection || !selectedRow) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Selecione um campo para editar suas propriedades</p>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    updateField(selectedSection.id, selectedRow.id, {
      ...selectedField,
      [name]: newValue,
    })
  }

  return (
    <div className="p-4 border-l h-full overflow-auto">
      <Tabs defaultValue="basic">
        <TabsList className="w-full">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="validation">Validação</TabsTrigger>
          <TabsTrigger value="visibility">Visibilidade</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Propriedades Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="label">Rótulo</Label>
                <Input
                  id="label"
                  name="label"
                  value={selectedField.label}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="name">Nome do Campo</Label>
                <Input id="name" name="name" value={selectedField.name} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  name="placeholder"
                  value={selectedField.placeholder}
                  onChange={handleChange}
                />
              </div>

              {(selectedField.type === 'select' ||
                selectedField.type === 'radio' ||
                selectedField.type === 'checkbox') && (
                <div>
                  <Label htmlFor="options">Opções</Label>
                  <Textarea
                    id="options"
                    name="options"
                    value={JSON.stringify(selectedField.options || [], null, 2)}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Validação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="required"
                  name="required"
                  checked={selectedField.validation?.required}
                  onCheckedChange={(checked) =>
                    updateField(selectedSection.id, selectedRow.id, {
                      ...selectedField,
                      validation: { ...selectedField.validation, required: !!checked },
                    })
                  }
                />
                <Label htmlFor="required">Campo Obrigatório</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="readonly"
                  name="readonly"
                  checked={selectedField.validation?.readonly}
                  onCheckedChange={(checked) =>
                    updateField(selectedSection.id, selectedRow.id, {
                      ...selectedField,
                      validation: { ...selectedField.validation, readonly: !!checked },
                    })
                  }
                />
                <Label htmlFor="readonly">Somente Leitura</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility">
          <Card>
            <CardHeader>
              <CardTitle>Visibilidade</CardTitle>
            </CardHeader>
            <CardContent>{/* Implementar configurações de visibilidade */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle>Estilo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="width">Largura</Label>
                <Select
                  value={selectedField.style?.width}
                  onValueChange={(value) =>
                    updateField(selectedSection.id, selectedRow.id, {
                      ...selectedField,
                      style: { ...selectedField.style, width: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a largura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25%">25%</SelectItem>
                    <SelectItem value="50%">50%</SelectItem>
                    <SelectItem value="75%">75%</SelectItem>
                    <SelectItem value="100%">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
