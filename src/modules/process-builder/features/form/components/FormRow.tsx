'use client'

import { useDroppable } from '@dnd-kit/core'
import type { FormComponent, FormRow } from '../types'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Trash2, Plus, Minus } from 'lucide-react'
import { SortableFormComponent } from './SortableForm'
import { getAvailableColumnsInRow, getAvailableIndices } from '../utils'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FormRowComponentProps {
  row: FormRow
  rowIndex: number
  onRemoveComponent: (componentId: string) => void
  onUpdateComponent: (componentId: string, updates: Partial<FormComponent>) => void
  onRemoveRow: () => void
  onRemoveRowColumns: () => void
  onAddRowColumns: () => void
  rowCount: number
}

const ColumnDroppable = ({ index, rowId }: { index: number; rowId: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${rowId}-column-${index}`,
    data: {
      rowId,
      columnIndex: index,
    },
  })

  return (
    <div key={index} className="col-span-1" ref={setNodeRef} data-column-index={index}>
      <div
        className={`border-2 border-dashed rounded-sm p-6 text-center text-muted-foreground transition-colors ${
          isOver ? 'bg-purple-50 border-purple-300' : ''
        }`}
      >
        <div className="text-sm">Arraste para esta coluna</div>
      </div>
    </div>
  )
}

export function FormRowComponent({
  row,
  rowIndex,
  onRemoveComponent,
  onUpdateComponent,
  onRemoveRow,
  onRemoveRowColumns,
  onAddRowColumns,
  rowCount,
}: FormRowComponentProps) {
  const { setNodeRef, isOver } = useDroppable({ id: row.id })
  const availableColumns = getAvailableColumnsInRow(row)
  const availableIndices = getAvailableIndices(row)
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRemoveRow = () => {
    const hasComponents = row.components.some((component) => component !== null)
    if (hasComponents) {
      setShowDeleteDialog(true)
    } else {
      onRemoveRow()
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div
          ref={setNodeRef}
          className={`transition-all duration-200 bg-white rounded-sm shadow-sm`}
        >
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Linha {rowIndex + 1}</span>
              <Badge variant="outline" className="text-xs">
                {row.columns} colunas
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {availableColumns} disponíveis
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemoveRowColumns()}
                disabled={availableColumns === 0 || row.columns === 1}
                title="Diminuir colunas"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-5 text-center">{row.columns}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAddRowColumns()}
                disabled={row.columns >= 4}
                title="Aumentar colunas"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={handleRemoveRow}
                disabled={rowCount <= 1}
                title="Remover linha"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className={`grid ${gridColsMap[row.columns]} gap-3`}>
              {row.components.map((component, componentIndex) =>
                component ? (
                  <div key={componentIndex} className={`col-span-${component.columnSpan} relative`}>
                    <SortableFormComponent
                      rowId={row.id}
                      component={component}
                      componentIndex={componentIndex}
                      onRemove={onRemoveComponent}
                      onUpdate={onUpdateComponent}
                      maxColumnSpan={row.columns}
                    />
                  </div>
                ) : (
                  availableIndices.includes(componentIndex) && (
                    <div key={componentIndex} className="col-span-1 relative">
                      <ColumnDroppable key={componentIndex} index={componentIndex} rowId={row.id} />
                    </div>
                  )
                ),
              )}
            </div>
          </CardContent>
        </div>
      </motion.div>

      <div>
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="z-[9999]">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Esta linha contém componentes. Tem certeza que deseja excluí-la?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onRemoveRow()
                  setShowDeleteDialog(false)
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
