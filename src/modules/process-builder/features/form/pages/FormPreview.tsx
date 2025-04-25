'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormBuilder } from '@/modules/process-builder/features/form/contexts/FormBuilderContext'
import { FormBuilderHeader } from '@/components/FormBuilderHeader'
import { FormProvider, useForm } from 'react-hook-form'
import { ContainerMain } from '@/components/ContainerMain'
import { FormComponent } from '@/modules/process-builder/features/form/types'
import { TextInput } from '@/modules/process-builder/features/form/components/inputs/TextInput'
import { CheckboxInput } from '@/modules/process-builder/features/form/components/inputs/CheckboxInput'
import { TitleInput } from '@/modules/process-builder/features/form/components/inputs/TitleInput'
import { SubtitleInput } from '@/modules/process-builder/features/form/components/inputs/SubtitleInput'
import { CheckboxGroupInput } from '@/modules/process-builder/features/form/components/inputs/CheckboxGroupInput'
import { SelectInput } from '@/modules/process-builder/features/form/components/inputs/SelectInput'
import { EmailInput } from '@/modules/process-builder/features/form/components/inputs/EmailInput'
import { PhoneInput } from '@/modules/process-builder/features/form/components/inputs/PhoneInput'
import { NumberInput } from '@/modules/process-builder/features/form/components/inputs/NumberInput'
import { DatePickerInput } from '@/modules/process-builder/features/form/components/inputs/DatePickerInput'
import { Label } from '@/components/ui/label'
import { TextareaInput } from '@/modules/process-builder/features/form/components/inputs/TextareaInput'

export function FormPreview() {
  const { rows } = useFormBuilder()
  const methods = useForm()

  const RenderFieldInput = ({ field }: { field: any }) => {
    switch (field.type) {
      case 'title':
        return <TitleInput field={field} />
      case 'subtitle':
        return <SubtitleInput field={field} />
      case 'text':
        return <TextInput field={field} />
      case 'checkbox':
        return <CheckboxInput field={field} />
      case 'checkbox-group':
        return <CheckboxGroupInput field={field} />
      case 'select':
        return <SelectInput field={field} />
      case 'email':
        return <EmailInput field={field} />
      case 'phone':
        return <PhoneInput field={field} />
      case 'number':
        return <NumberInput field={field} />
      case 'textarea':
        return <TextareaInput field={field} />
      case 'datepicker':
        return <DatePickerInput field={field} />
      default:
        return <span>Campo não encontrado</span>
    }
  }

  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <Card className="w-full max-[1000px] mx-auto px-16 shadow-none border-none">
      <CardHeader className="mb-10">
        <CardTitle>Pré-visualização do Formulário</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Adicione campos ao seu formulário para visualizar como ficará.</p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
              <div>
                {rows.map((row) => (
                  <div key={row.id} className={`grid gap-4 mb-6 ${gridColsMap[row.columns]}`}>
                    {row.components.map((component, index) => (
                      <div key={index} className="min-h-[1px]">
                        {component && (
                          <div className="flex flex-col gap-4">
                            {component.type !== 'title' && component.type !== 'subtitle' && (
                              <Label>{component.label}</Label>
                            )}
                            <RenderFieldInput field={component} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {rows.length > 0 && (
                <CardFooter className="px-0 flex justify-end">
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600 rounded-sm">
                    Enviar
                  </Button>
                </CardFooter>
              )}
            </form>
          </FormProvider>
        )}
      </CardContent>
    </Card>
  )
}
