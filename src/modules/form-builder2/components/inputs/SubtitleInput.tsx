import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'

interface BaseInputProps {
  field: FormComponent
}

export function SubtitleInput({ field }: BaseInputProps) {
  return (
    <div className="w-full">
      {field.label && <Label className="text-sm text-muted-foreground/80">{field.label}</Label>}
    </div>
  )
}
