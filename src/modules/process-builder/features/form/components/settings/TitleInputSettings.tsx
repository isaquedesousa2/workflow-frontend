import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/process-builder/features/form/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect } from 'react'

const titleSchema = z.object({
  label: z.string().min(1, {
    message: 'O título é obrigatório',
  }),
})

interface TitleInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function TitleInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: TitleInputSettingsProps) {
  const form = useForm<z.infer<typeof titleSchema>>({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      label: component.label || '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const hasErrors = Object.keys(form.formState.errors).length > 0
    const isLabelEmpty = !form.getValues('label')
    onErrorChange(hasErrors || isLabelEmpty)
  }, [form.formState.errors, form, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof titleSchema>, value: string) => {
    form.setValue(field, value, { shouldValidate: value.length > 0 })
    onUpdate({ [field]: value })
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Título <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="Digite o título"
                  onChange={(e) => handleChange('label', e.target.value)}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
