import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/process-builder/features/form/types'

interface SubtitleInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
}

export function SubtitleInputSettings({ component, onUpdate }: SubtitleInputSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Subtítulo</Label>
        <Input
          id="label"
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Digite o subtítulo"
        />
      </div>
    </div>
  )
}
