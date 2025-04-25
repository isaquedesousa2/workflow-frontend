import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/process-builder/features/form/types'

interface BaseInputProps {
  field: FormComponent
}

export function SubtitleInput({ field }: BaseInputProps) {
  return <Label className="text-lg">{field.label}</Label>
}
