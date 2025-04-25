import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ITextareaField } from '../../types'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'

interface TextareaInputSettingsProps {
  component: ITextareaField
  onUpdate: (updates: Partial<ITextareaField>) => void
}

export const TextareaInputSettings = ({ component, onUpdate }: TextareaInputSettingsProps) => {
  const form = useForm({
    defaultValues: {
      label: component.label,
      name: component.name,
      placeholder: component.placeholder,
      required: component.required,
      disabled: component.disabled,
      rowsCount: component.rowsCount || 4,
    },
  })

  const { watch } = form

  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate({
        ...component,
        ...value,
      })
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
                <Input placeholder="Digite o label do campo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do campo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do campo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input placeholder="Digite o placeholder" {...field} />
              </FormControl>
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
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
                  <Switch id="required" checked={field.value} onCheckedChange={field.onChange} />
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
                  <Switch id="disabled" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  )
}
