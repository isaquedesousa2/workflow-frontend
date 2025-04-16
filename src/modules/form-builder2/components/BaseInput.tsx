import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'

interface BaseInputProps {
  field: FormComponent
  input: React.ReactNode
}

export function BaseInput({ field, input }: BaseInputProps) {
  return (
    <div>
      {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
      {input}
    </div>
  )
}
