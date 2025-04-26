import { ICheckboxField } from '@/modules/process-builder/features/form/types'
import { Checkbox } from '@/components/ui/checkbox'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface CheckboxInputProps {
  field: ICheckboxField
}

export function CheckboxInput({ field }: CheckboxInputProps) {
  const { id, isChecked } = field

  return (
    <BaseInput component={field} className="flex items-center gap-5">
      <Checkbox id={id} checked={isChecked} />
    </BaseInput>
  )
}
