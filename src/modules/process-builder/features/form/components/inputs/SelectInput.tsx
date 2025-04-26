import {
  FormComponent,
  FormOption,
  SelectField,
} from '@/modules/process-builder/features/form/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface BaseInputProps {
  field: SelectField
}

export function SelectInput({ field }: BaseInputProps) {
  return (
    <BaseInput component={field} className="flex flex-col gap-5">
      <Select>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
      </Select>
    </BaseInput>
  )
}
