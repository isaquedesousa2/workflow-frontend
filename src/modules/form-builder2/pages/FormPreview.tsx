'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormBuilder } from '@/modules/form-builder2/contexts/FormBuilderContext'
import { FormBuilderHeader } from '@/components/FormBuilderHeader'
import { FormProvider, useForm } from 'react-hook-form'
import { ContainerMain } from '@/components/ContainerMain'
import { FormComponent } from '@/modules/form-builder2/types'
import { TextInput } from '@/modules/form-builder2/components/inputs/TextInput'
import { CheckboxInput } from '@/modules/form-builder2/components/inputs/CheckboxInput'
import { TitleInput } from '@/modules/form-builder2/components/inputs/TitleInput'
import { SubtitleInput } from '@/modules/form-builder2/components/inputs/SubtitleInput'
import { CheckboxGroupInput } from '@/modules/form-builder2/components/inputs/CheckboxGroupInput'
import { SelectInput } from '@/modules/form-builder2/components/inputs/SelectInput'
export function FormPreview() {
  const { rows } = useFormBuilder()
  const methods = useForm()

  const RenderFieldInput = ({ field }: { field: FormComponent }) => {
    switch (field.type) {
      case 'title':
        return <TitleInput field={field} />
      case 'subtitle':
        return <SubtitleInput field={field} />
      case 'text':
        return <TextInput field={field} />
      case 'textarea':
        return <TextInput field={field} />
      case 'checkbox':
        return <CheckboxInput field={field} />
      case 'checkbox-group':
        return <CheckboxGroupInput field={field} />
      case 'select':
        return <SelectInput field={field} />
      default:
        return <TextInput field={field} />
    }
  }

  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <ContainerMain
      header={<FormBuilderHeader version={1} isEditable={false} hasBackButton={true} />}
    >
      <Card className="w-full max-[1000px] mx-auto">
        <CardHeader>
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
                          {component && <RenderFieldInput field={component} />}
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
    </ContainerMain>
  )
}
