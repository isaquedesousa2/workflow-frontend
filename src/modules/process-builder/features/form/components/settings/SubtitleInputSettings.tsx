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

const subtitleSchema = z.object({
  label: z.string().min(1, {
    message: 'O subtítulo é obrigatório',
  }),
})

interface SubtitleInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function SubtitleInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: SubtitleInputSettingsProps) {
  const form = useForm<z.infer<typeof subtitleSchema>>({
    resolver: zodResolver(subtitleSchema),
    defaultValues: {
      label: component.label || '',
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

  const handleChange = (field: keyof z.infer<typeof subtitleSchema>, value: string) => {
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
              <FormLabel>Subtítulo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="Digite o subtítulo"
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
