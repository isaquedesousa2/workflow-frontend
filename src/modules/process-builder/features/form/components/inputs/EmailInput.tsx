import { Label } from '@/components/ui/label'
import { EmailField } from '@/modules/process-builder/features/form/types'
import { Input } from '@/components/ui/input'

interface BaseInputProps {
  field: EmailField
}

export function EmailInput({ field }: BaseInputProps) {
  const { id, description, required, placeholder, defaultValue } = field

  return (
    <div id={id} className="space-y-2">
      <Input
        type="email"
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full"
      />
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {required && <span className="text-red-500">*</span>}
    </div>
  )
}
