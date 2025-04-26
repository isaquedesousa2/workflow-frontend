import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TextField } from '../../types'
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

const textInputSchema = z.object({
  label: z.string().min(1, {
    message: 'O nome do campo é obrigatório',
  }),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  required: z.boolean().default(false),
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(0).optional(),
  readOnly: z.boolean().default(false),
})

interface TextInputSettingsProps {
  component: TextField
  onUpdate: (updates: Partial<TextField>) => void
  onErrorChange: (hasError: boolean) => void
}

export function TextInputSettings({ component, onUpdate, onErrorChange }: TextInputSettingsProps) {
  const form = useForm<z.infer<typeof textInputSchema>>({
    resolver: zodResolver(textInputSchema),
    defaultValues: {
      label: component.label || '',
      placeholder: component.placeholder || '',
      defaultValue: component.defaultValue || '',
      required: component.required || false,
      minLength: component.minLength || 0,
      maxLength: component.maxLength || 0,
      readOnly: component.readOnly || false,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const hasErrors = Object.keys(form.formState.errors).length > 0
    const isLabelEmpty = !form.getValues('label')
    onErrorChange(hasErrors || isLabelEmpty)
  }, [form.formState.errors, form, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof textInputSchema>, value: any) => {
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
                <Input
                  {...field}
                  placeholder="Digite o valor padrão"
                  autoComplete="off"
                  onChange={(e) => handleChange('defaultValue', e.target.value)}
                />
              </FormControl>
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
          name="minLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho Mínimo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Digite o tamanho mínimo"
                  autoComplete="off"
                  onChange={(e) => handleChange('minLength', parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho Máximo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Digite o tamanho máximo"
                  autoComplete="off"
                  onChange={(e) => handleChange('maxLength', parseInt(e.target.value) || 0)}
                />
              </FormControl>
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
      </div>
    </Form>
  )
}
