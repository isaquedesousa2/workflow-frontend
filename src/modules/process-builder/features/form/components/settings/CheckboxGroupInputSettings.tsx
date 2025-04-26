import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ICheckboxGroupField } from '@/modules/process-builder/features/form/types'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface CheckboxGroupInputSettingsProps {
  component: ICheckboxGroupField
  onUpdate: (updates: Partial<ICheckboxGroupField>) => void
}

export function CheckboxGroupInputSettings({
  component,
  onUpdate,
}: CheckboxGroupInputSettingsProps) {
  const handleAddOption = () => {
    const newOption = {
      label: '',
      value: `opcao-${(component.options?.length || 0) + 1}`,
    }
    onUpdate({
      options: [...(component.options || []), newOption],
    })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(component.options || [])]
    newOptions.splice(index, 1)
    onUpdate({ options: newOptions })
  }

  const handleOptionChange = (index: number, field: 'label' | 'value', value: string) => {
    const newOptions = [...(component.options || [])]
    newOptions[index] = { ...newOptions[index], [field]: value }
    onUpdate({ options: newOptions })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome do Campo</Label>
        <Input
          id="label"
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Digite o nome do campo"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="multiple">Seleção Múltipla</Label>
          <Switch
            id="multiple"
            checked={component.multiple ?? false}
            onCheckedChange={(checked: boolean) => onUpdate({ multiple: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Opções</Label>
        <div className="space-y-2">
          {component.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                placeholder="Digite o texto da opção"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleAddOption} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Opção
        </Button>
      </div>
    </div>
  )
}
