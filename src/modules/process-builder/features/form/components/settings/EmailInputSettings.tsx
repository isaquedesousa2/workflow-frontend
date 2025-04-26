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

const emailSchema = z.object({
  label: z.string().min(1, {
    message: 'O nome do campo é obrigatório',
  }),
  placeholder: z.string().optional(),
  defaultValue: z.string().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Por favor, insira um email válido',
  }),
  description: z.string().optional(),
})

interface EmailInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function EmailInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: EmailInputSettingsProps) {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      label: component.label || '',
      placeholder: component.placeholder || '',
      defaultValue: component.defaultValue || '',
      description: component.description || '',
    },
    mode: 'onChange',
  })

  // Atualiza o estado de erro sempre que o formState mudar
  useEffect(() => {
    const hasErrors = Object.keys(form.formState.errors).length > 0
    const isLabelEmpty = !form.getValues('label')
    onErrorChange(hasErrors || isLabelEmpty)
  }, [form.formState.errors, form, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof emailSchema>, value: string) => {
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
                Título do Campo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o título do campo"
                  autoComplete="off"
                  onChange={(e) => handleChange('label', e.target.value)}
                />
              </FormControl>
              <FormDescription />
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
              <FormDescription />
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
                <Input
                  {...field}
                  type="email"
                  placeholder="exemplo@email.com"
                  autoComplete="off"
                  onChange={(e) => handleChange('defaultValue', e.target.value)}
                />
              </FormControl>
              <FormDescription />
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
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
