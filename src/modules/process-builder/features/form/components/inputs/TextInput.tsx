import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'
import { Input } from '@/components/ui/input'
interface BaseInputProps {
  field: FormComponent
}

export function TextInput({ field }: BaseInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
      <Input />
    </div>
  )
}
