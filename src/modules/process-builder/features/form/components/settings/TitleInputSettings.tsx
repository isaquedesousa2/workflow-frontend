import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/form-builder2/types'

interface TitleInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
}

export function TitleInputSettings({ component, onUpdate }: TitleInputSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Título</Label>
        <Input
          id="label"
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Digite o título"
        />
      </div>
    </div>
  )
}
