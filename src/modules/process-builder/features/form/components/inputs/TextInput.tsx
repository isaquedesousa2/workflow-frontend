import { TextField } from '@/modules/process-builder/features/form/types'
import { Input } from '@/components/ui/input'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface BaseInputProps {
  field: TextField
}

export function TextInput({ field }: BaseInputProps) {
  return (
    <BaseInput component={field} className="space-y-2">
      <Input
        id={field.id}
        placeholder={field.placeholder}
        defaultValue={field.defaultValue}
        maxLength={field.maxLength}
        minLength={field.minLength}
        readOnly={field.readOnly}
        disabled={field.readOnly}
      />
    </BaseInput>
  )
}
