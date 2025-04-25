import { CheckboxField } from '@/modules/process-builder/features/form/types'
import { Checkbox } from '@/components/ui/checkbox'

interface BaseInputProps {
  field: CheckboxField
}

export function CheckboxInput({ field }: BaseInputProps) {
  const { id, description, required, isChecked } = field

  return (
    <div id={id} className="flex items-center gap-5">
      <Checkbox id={id} checked={isChecked} />
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {required && <span className="text-red-500">*</span>}
    </div>
  )
}
