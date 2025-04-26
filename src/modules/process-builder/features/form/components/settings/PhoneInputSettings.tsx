import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/process-builder/features/form/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect } from 'react'
import { PatternFormat } from 'react-number-format'

const phoneSchema = z.object({
  label: z.string().min(1, {
    message: 'O nome do campo é obrigatório',
  }),
  placeholder: z.string().optional(),
  defaultValue: z.string().refine((val) => !val || /^\(\d{2}\) \d{5}-\d{4}$/.test(val), {
    message: 'Por favor, insira um telefone válido (10 ou 11 dígitos)',
  }),
  description: z.string().optional(),
})

interface PhoneInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function PhoneInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: PhoneInputSettingsProps) {
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      label: component.label || '',
      placeholder: component.placeholder || '',
      defaultValue: component.defaultValue || '',
      description: component.description || '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const hasErrors = Object.keys(form.formState.errors).length > 0
    const isLabelEmpty = !form.getValues('label')
    onErrorChange(hasErrors || isLabelEmpty)
  }, [form.formState.errors, form, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof phoneSchema>, value: string) => {
    form.setValue(field, value, { shouldValidate: true })
    onUpdate({ [field]: value })
  }

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nome do Campo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o nome do campo"
                  autoComplete="off"
                  onChange={(e) => handleChange('label', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de Ajuda</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o texto de ajuda"
                  autoComplete="off"
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Padrão</FormLabel>
              <FormControl>
                <PatternFormat
                  {...field}
                  format="(##) #####-####"
                  mask="_"
                  placeholder="(00) 00000-0000"
                  autoComplete="off"
                  customInput={Input}
                  className="w-full"
                  type="tel"
                  onValueChange={(values) => handleChange('defaultValue', values.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite a descrição do campo"
                  autoComplete="off"
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
