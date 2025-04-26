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
import { Switch } from '@/components/ui/switch'

const emailSchema = z.object({
  label: z.string().min(1, { message: 'O nome do campo é obrigatório' }),
  placeholder: z.string().optional(),
  defaultValue: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Por favor, insira um email válido',
    }),
  description: z.string().optional(),
  readOnly: z.boolean().default(false),
  required: z.boolean().default(false),
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
      readOnly: component.readOnly || false,
      required: component.required || false,
    },
    mode: 'onChange',
    criteriaMode: 'all',
  })

  useEffect(() => {
    const isLabelEmpty = !form.getValues('label')
    const hasError = !form.formState.isValid || isLabelEmpty

    onErrorChange(hasError)
  }, [form.watch('label'), form.formState.isValid, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof emailSchema>, value: string | boolean) => {
    form.setValue(field, value, { shouldValidate: true })
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

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Campo Obrigatório</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => handleChange('required', checked)}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="readOnly"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Somente Leitura</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => handleChange('readOnly', checked)}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
