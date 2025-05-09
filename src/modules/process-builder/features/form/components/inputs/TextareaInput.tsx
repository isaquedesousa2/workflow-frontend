import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { ITextareaField } from '../../types'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface TextareaInputProps {
  field: ITextareaField
}

export const TextareaInput = ({ field }: TextareaInputProps) => {
  const form = useFormContext()

  return (
    <BaseInput component={field} className="space-y-2">
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder={field.placeholder}
              {...formField}
              disabled={field.disabled}
              required={field.required}
              rows={field.rowsCount}
              className="resize-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    </BaseInput>
  )
}
