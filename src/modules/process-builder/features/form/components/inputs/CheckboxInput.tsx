import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'
import { Checkbox } from '@/components/ui/checkbox'

interface BaseInputProps {
  field: FormComponent
}

export function CheckboxInput({ field }: BaseInputProps) {
  return (
    <div className="flex items-center gap-5">
      {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
      <Checkbox id={field.id} />
    </div>
  )
}
