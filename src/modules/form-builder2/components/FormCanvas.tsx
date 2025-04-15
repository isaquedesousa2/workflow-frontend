'use client'

import { DropIndicator, FormComponent, FormRow } from '../types'
import { AnimatePresence } from 'framer-motion'
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
  onUpdateRowColumns: (rowIndex: number, columns: number) => void
  dropIndicator: DropIndicator
  isDraggingOver: boolean
  dragOverRowId: string | null
}

export function FormCanvas({
  rows,
  onRemoveComponent,
  onUpdateComponent,
  onRemoveRow,
  onUpdateRowColumns,
  dropIndicator,
  isDraggingOver,
  dragOverRowId,
}: FormCanvasProps) {
  return (
    <div className="space-y-6">
      <AnimatePresence>
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
            onUpdateColumns={(columns) => onUpdateRowColumns(rowIndex, columns)}
            dropIndicator={dropIndicator}
            isActive={dragOverRowId === row.id}
            rowCount={rows.length}
          />
        ))}
      </AnimatePresence>

      {rows.length === 0 && (
        <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">
          Adicione uma linha para começar a construir seu formulário
        </div>
      )}
    </div>
  )
}
