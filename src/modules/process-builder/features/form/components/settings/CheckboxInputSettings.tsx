import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormComponent } from '@/modules/process-builder/features/form/types'

interface CheckboxInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
}

export function CheckboxInputSettings({ component, onUpdate }: CheckboxInputSettingsProps) {
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
          <Label htmlFor="defaultValue">Marcado por Padrão</Label>
          <Switch
            id="defaultValue"
            checked={component.defaultValue === 'true'}
            onCheckedChange={(checked: boolean) =>
              onUpdate({ defaultValue: checked ? 'true' : 'false' })
            }
          />
        </div>
      </div>
    </div>
  )
}
