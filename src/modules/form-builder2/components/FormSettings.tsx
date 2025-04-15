'use client'

import type { FormComponent } from '../types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface ComponentSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
}

export function ComponentSettings({ component, onUpdate }: ComponentSettingsProps) {
  return (
    <div className="space-y-3 border-t pt-3 mt-3">
      <div className="grid gap-2">
        <Label htmlFor={`${component.id}-label`}>Label</Label>
        <Input
          id={`${component.id}-label`}
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Field label"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${component.id}-placeholder`}>Placeholder</Label>
        <Input
          id={`${component.id}-placeholder`}
          value={component.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Field placeholder"
        />
      </div>

      {(component.type === 'text' || component.type === 'textarea') && (
        <div className="grid gap-2">
          <Label htmlFor={`${component.id}-defaultValue`}>Default Value</Label>
          <Input
            id={`${component.id}-defaultValue`}
            value={component.defaultValue || ''}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            placeholder="Default value"
          />
        </div>
      )}

      {component.type === 'select' && (
        <div className="grid gap-2">
          <Label htmlFor={`${component.id}-options`}>Options (one per line)</Label>
          <Textarea
            id={`${component.id}-options`}
            value={component.options?.join('\n') || ''}
            onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(Boolean) })}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            className="min-h-[100px]"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${component.id}-required`}
          checked={component.required || false}
          onCheckedChange={(checked) => onUpdate({ required: !!checked })}
        />
        <Label htmlFor={`${component.id}-required`}>Required field</Label>
      </div>
    </div>
  )
}
