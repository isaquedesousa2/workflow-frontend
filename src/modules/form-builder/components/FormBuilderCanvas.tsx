'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import type { FormField } from '../types/form-builder'
import { FormFieldRenderer } from './FormFieldRenderer'

interface ColumnDropAreaProps {
  rowId: string
  columnId: string
  fields: FormField[]
}

function ColumnDropArea({ rowId, columnId, fields }: ColumnDropAreaProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${columnId}`,
    data: {
      type: 'COLUMN',
      rowId,
      columnId,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] p-2 rounded-md border-2 border-dashed ${
        fields.length === 0 ? 'border-gray-300 bg-gray-50' : 'border-transparent'
      }`}
    >
      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Arraste campos aqui
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <FormFieldRenderer key={field.id} field={field} rowId={rowId} columnId={columnId} />
          ))}
        </div>
      )}
    </div>
  )
}

interface RowProps {
  rowId: string
  columns: { id: string; fields: FormField[] }[]
}

function Row({ rowId, columns }: RowProps) {
  const { updateRowColumns, removeRow } = useFormBuilder()

  return (
    <Card className="mb-4">
      <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Linha</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue={columns.length.toString()}
            onValueChange={(value) => updateRowColumns(rowId, Number.parseInt(value))}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Colunas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Coluna</SelectItem>
              <SelectItem value="2">2 Colunas</SelectItem>
              <SelectItem value="3">3 Colunas</SelectItem>
              <SelectItem value="4">4 Colunas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => removeRow(rowId)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div
          className={`grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <ColumnDropArea
              key={column.id}
              rowId={rowId}
              columnId={column.id}
              fields={column.fields}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function FormBuilderCanvas({ formFields }: { formFields: FormField[] }) {
  const { rows, addRow, activeField } = useFormBuilder()
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })

  return (
    <div ref={setNodeRef} className="flex flex-col h-full border-r w-full">
      <div className="p-4 border-b">
        <Button onClick={addRow} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar linha
        </Button>
      </div>
      <div className="p-4 overflow-y-auto overflow-x-hidden">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="mb-4 text-5xl">📝</div>
            <p className="mb-2">Seu formulário está vazio</p>
            <p className="text-sm">Adicione uma linha para começar a construir seu formulário</p>
          </div>
        ) : (
          <div>
            {rows.map((row) => (
              <Row key={row.id} rowId={row.id} columns={row.columns} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
