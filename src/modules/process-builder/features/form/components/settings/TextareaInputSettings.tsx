import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ITextareaField } from '../../types'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const textareaSchema = z.object({
  label: z.string().min(1, {
    message: 'O título do campo é obrigatório',
  }),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  disabled: z.boolean().default(false),
  rowsCount: z.number().min(1).default(4),
})

interface TextareaInputSettingsProps {
  component: ITextareaField
  onUpdate: (updates: Partial<ITextareaField>) => void
  onErrorChange: (hasError: boolean) => void
}

export const TextareaInputSettings = ({
  component,
  onUpdate,
  onErrorChange,
}: TextareaInputSettingsProps) => {
  const form = useForm<z.infer<typeof textareaSchema>>({
    resolver: zodResolver(textareaSchema),
    defaultValues: {
      label: component.label,
      placeholder: component.placeholder,
      required: component.required || false,
      disabled: component.disabled || false,
      rowsCount: component.rowsCount || 4,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasErrors = Object.keys(form.formState.errors).length > 0
      onErrorChange(hasErrors || !form.formState.isValid)
    })
    return () => subscription.unsubscribe()
  }, [form, onErrorChange])

  const handleChange = (field: keyof z.infer<typeof textareaSchema>, value: any) => {
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
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o título do campo"
                  {...field}
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
              <FormLabel>Texto de ajuda</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o texto de ajuda"
                  {...field}
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rowsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de linhas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número de linhas"
                  {...field}
                  onChange={(e) => handleChange('rowsCount', Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Label htmlFor="required">Obrigatório</Label>
          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    id="required"
                    checked={field.value}
                    onCheckedChange={(checked) => handleChange('required', checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="disabled">Desabilitado</Label>
          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    id="disabled"
                    checked={field.value}
                    onCheckedChange={(checked) => handleChange('disabled', checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  )
}
