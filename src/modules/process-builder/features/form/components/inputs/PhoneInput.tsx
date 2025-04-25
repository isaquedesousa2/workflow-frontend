import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface BaseInputProps {
  field: FormComponent
}

export function PhoneInput({ field }: BaseInputProps) {
  const [value, setValue] = useState(field.defaultValue || '')

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '')
    let formatted = cleaned

    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        formatted = `(${cleaned}`
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
      } else if (cleaned.length <= 10) {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
      } else {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
      }
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue(formatted)
  }

  return (
    <div className="space-y-2">
      {field.label && <Label className="text-sm font-medium">{field.label}</Label>}
      <Input
        type="tel"
        id={field.id}
        placeholder={field.placeholder || '(00) 00000-0000'}
        value={value}
        onChange={handleChange}
        maxLength={15}
        className="w-full"
      />
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
