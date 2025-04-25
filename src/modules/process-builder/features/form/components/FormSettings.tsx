'use client'

import type { FormComponent } from '../types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface ComponentSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
}

export function ComponentSettings({ component, onUpdate }: ComponentSettingsProps) {
  return (
    <div className="space-y-3 border-t pt-3 mt-3">
      <div className="grid gap-2">
        <Label htmlFor={`${component.id}-name`}>Nome</Label>
        <Input
          id={`${component.id}-name`}
          value={component.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Nome do campo"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${component.id}-label`}>Label</Label>
        <Input
          id={`${component.id}-label`}
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Field label"
        />
      </div>

      {(component.type === 'text' ||
        component.type === 'textarea' ||
        component.type === 'select') && (
        <>
          <div className="grid gap-2">
            <Label htmlFor={`${component.id}-placeholder`}>Placeholder</Label>
            <Input
              id={`${component.id}-placeholder`}
              value={component.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Field placeholder"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${component.id}-defaultValue`}>Default Value</Label>
            <Input
              id={`${component.id}-defaultValue`}
              value={component.defaultValue || ''}
              onChange={(e) => onUpdate({ defaultValue: e.target.value })}
              placeholder="Default value"
            />
          </div>
        </>
      )}

      {component.type === 'select' && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Opções</Label>
            <div className="space-y-2">
              {component.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={option.label || ''}
                    onChange={(e) => {
                      const newOptions = [...(component.options || [])]
                      newOptions[index] = { ...newOptions[index], label: e.target.value }
                      onUpdate({ options: newOptions })
                    }}
                  />
                  <Input
                    placeholder="Valor"
                    value={option.value || ''}
                    onChange={(e) => {
                      const newOptions = [...(component.options || [])]
                      newOptions[index] = { ...newOptions[index], value: e.target.value }
                      onUpdate({ options: newOptions })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = [...(component.options || [])]
                      newOptions.splice(index, 1)
                      onUpdate({ options: newOptions })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const newOptions = [...(component.options || []), { label: '', value: '' }]
                onUpdate({ options: newOptions })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>
        </div>
      )}

      {component.type !== 'title' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${component.id}-required`}
            checked={component.required || false}
            onCheckedChange={(checked) => onUpdate({ required: !!checked })}
          />
        </div>
      )}

      {component.type === 'checkbox-group' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${component.id}-multiple`}
              checked={component.multiple || false}
              onCheckedChange={(checked) => onUpdate({ multiple: !!checked })}
            />
            <Label htmlFor={`${component.id}-multiple`}>Permitir múltiplas escolhas</Label>
          </div>
          <div className="grid gap-2">
            <Label>Opções</Label>
            <div className="space-y-2">
              {component.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={option.label || ''}
                    onChange={(e) => {
                      const newOptions = [...(component.options || [])]
                      newOptions[index] = { ...newOptions[index], label: e.target.value }
                      onUpdate({ options: newOptions })
                    }}
                  />
                  <Input
                    placeholder="Valor"
                    value={option.value || ''}
                    onChange={(e) => {
                      const newOptions = [...(component.options || [])]
                      newOptions[index] = { ...newOptions[index], value: e.target.value }
                      onUpdate({ options: newOptions })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = [...(component.options || [])]
                      newOptions.splice(index, 1)
                      onUpdate({ options: newOptions })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const newOptions = [...(component.options || []), { label: '', value: '' }]
                onUpdate({ options: newOptions })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
