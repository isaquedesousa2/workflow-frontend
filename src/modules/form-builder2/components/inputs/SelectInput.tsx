import { Label } from '@/components/ui/label'
import { FormComponent, FormOption } from '@/modules/form-builder2/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BaseInputProps {
  field: FormComponent
}

export function SelectInput({ field }: BaseInputProps) {
  return (
    <div className="flex flex-col gap-5">
      {field.label && <Label>{field.label}</Label>}
      <Select>
        <SelectTrigger>
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
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
