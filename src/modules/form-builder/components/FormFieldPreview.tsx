'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { FormFieldRenderer } from './FormFieldRenderer'
import { FormProvider, useForm } from 'react-hook-form'

export function FormPreview() {
  const { rows } = useFormBuilder()
  const methods = useForm()

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 min-w-[500px] overflow-y-auto">
      <Card className="w-full max-w-3xl mx-auto">
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
                    <div
                      key={row.id}
                      className={`grid gap-4 mb-6`}
                      style={{
                        gridTemplateColumns: `repeat(${row?.columns?.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.columns.map((column) => (
                        <div key={column.id}>
                          {column.fields.map((field) => (
                            <FormFieldRenderer
                              key={field.id}
                              field={field}
                              rowId={row.id}
                              columnId={column.id}
                              isPreview={true}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {rows.length > 0 && (
                  <CardFooter className="px-0">
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      Enviar
                    </Button>
                  </CardFooter>
                )}
              </form>
            </FormProvider>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
