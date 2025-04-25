import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'

interface BaseInputProps {
  field: FormComponent
}

export function TitleInput({ field }: BaseInputProps) {
  return (
    <div className="w-full">
      {field.label && <Label className="text-lg text-muted-foreground">{field.label}</Label>}
    </div>
  )
}
