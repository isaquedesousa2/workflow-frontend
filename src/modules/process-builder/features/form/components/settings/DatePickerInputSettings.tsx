import { useFormBuilder } from '../../contexts/FormBuilderContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { IDatePickerField } from '../../types'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/DatePicker'

interface DatePickerInputSettingsProps {
  component: IDatePickerField
  onUpdate: (updates: Partial<IDatePickerField>) => void
}

export const DatePickerInputSettings = ({ component, onUpdate }: DatePickerInputSettingsProps) => {
  const form = useForm({
    defaultValues: {
      label: component.label,
      name: component.name,
      placeholder: component.placeholder,
      required: component.required,
      disabled: component.disabled,
      mode: component.mode || 'single',
      minDate: component.minDate || '',
      maxDate: component.maxDate || '',
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
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modo de seleção</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Data única</SelectItem>
                  <SelectItem value="range">Intervalo</SelectItem>
                  <SelectItem value="multiple">Múltiplas datas</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data mínima</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data máxima</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
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
