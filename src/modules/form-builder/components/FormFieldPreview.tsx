'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { FormFieldRenderer } from './FormFieldRenderer'

export function FormPreview() {
  const { rows } = useFormBuilder()

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 min-w-[500px]">
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
          )}
        </CardContent>
        {rows.length > 0 && (
          <CardFooter>
            <Button className="bg-orange-500 hover:bg-orange-600">Enviar</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
