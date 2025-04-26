import { EmailField } from '@/modules/process-builder/features/form/types'
import { Input } from '@/components/ui/input'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface BaseInputProps {
  field: EmailField
}

export function EmailInput({ field }: BaseInputProps) {
  return (
    <BaseInput component={field} className="space-y-2">
      <Input
        type="email"
        id={field.id}
        placeholder={field.placeholder}
        defaultValue={field.defaultValue}
        readOnly={field.readOnly}
        disabled={field.readOnly}
        required={field.required}
        className="w-full"
      />
    </BaseInput>
  )
}
