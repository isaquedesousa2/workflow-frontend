'use client'

import { FormComponent, FormRow } from '../types'
import { FormRowComponent } from './FormRow'

interface FormCanvasProps {
  rows: FormRow[]
  onRemoveComponent: (rowIndex: number, componentId: string) => void
  onUpdateComponent: (
    rowIndex: number,
    componentId: string,
    updates: Partial<FormComponent>,
  ) => void
  onRemoveRow: (rowIndex: number) => void
  onRemoveRowColumns: (rowIndex: number) => void
  onAddRowColumns: (rowIndex: number) => void
}

export function FormCanvas({
  rows,
  onRemoveComponent,
  onUpdateComponent,
  onRemoveRow,
  onRemoveRowColumns,
  onAddRowColumns,
}: FormCanvasProps) {
  return (
    <div className="space-y-6">
      {rows.map((row, rowIndex) => (
        <FormRowComponent
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          onRemoveComponent={(componentId) => onRemoveComponent(rowIndex, componentId)}
          onUpdateComponent={(componentId, updates) =>
            onUpdateComponent(rowIndex, componentId, updates)
          }
          onRemoveRow={() => onRemoveRow(rowIndex)}
          onRemoveRowColumns={() => onRemoveRowColumns(rowIndex)}
          onAddRowColumns={() => onAddRowColumns(rowIndex)}
          rowCount={rows.length}
        />
      ))}

      {rows.length === 0 && (
        <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">
          Adicione uma linha para começar a construir seu formulário
        </div>
      )}
    </div>
  )
}
