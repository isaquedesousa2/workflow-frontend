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

interface BaseInputProps {
  field: SelectField
}

export function SelectInput({ field }: BaseInputProps) {
  const { placeholder, description, required, id, options } = field

  return (
    <div id={id} className="flex flex-col gap-5">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || 'Selecione uma opção'} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {required && <span className="text-red-500">*</span>}
    </div>
  )
}
