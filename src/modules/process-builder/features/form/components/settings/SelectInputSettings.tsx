import {
  FormComponent,
  FormOption,
  ISelectField,
  SelectField,
} from '@/modules/process-builder/features/form/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface SelectInputSettingsProps {
  component: ISelectField
  onUpdate: (component: Partial<ISelectField>) => void
}

export function SelectInputSettings({ component, onUpdate }: SelectInputSettingsProps) {
  const [options, setOptions] = useState<FormOption[]>(component.options || [])

  const handleAddOption = () => {
    const newOptions = [...options, { label: '', value: '' }]
    setOptions(newOptions)
    onUpdate({ ...component, options: newOptions })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    onUpdate({ ...component, options: newOptions })
  }

  const handleOptionChange = (index: number, key: keyof FormOption, value: string) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return { ...option, [key]: value }
      }
      return option
    })
    setOptions(newOptions)
    onUpdate({ ...component, options: newOptions })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ''}
          onChange={(e) => onUpdate({ ...component, placeholder: e.target.value })}
          placeholder="Digite o placeholder"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={component.description || ''}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
          placeholder="Digite a descrição"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={component.required}
          onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
        />
        <Label htmlFor="required">Campo obrigatório</Label>
      </div>

      <div className="space-y-2">
        <Label>Opções</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Rótulo"
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
              />
              <Input
                placeholder="Valor"
                value={option.value}
                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleAddOption}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar opção
        </Button>
      </div>
    </div>
  )
}
