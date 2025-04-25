import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/process-builder/features/form/types'

interface BaseInputProps {
  field: FormComponent
}

export function TitleInput({ field }: BaseInputProps) {
  return field.label && <Label className="text-2xl">{field.label}</Label>
}
