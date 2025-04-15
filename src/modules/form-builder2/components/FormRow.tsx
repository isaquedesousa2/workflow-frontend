'use client'

import { useDroppable } from '@dnd-kit/core'
import type { DropIndicator, FormComponent, FormRow } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Trash2, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { SortableFormComponent } from './SortableForm'
import { getAvailableColumnsInRow } from '../utils'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface FormRowComponentProps {
  row: FormRow
  rowIndex: number
  onRemoveComponent: (componentId: string) => void
  onUpdateComponent: (componentId: string, updates: Partial<FormComponent>) => void
  onRemoveRow: () => void
  onUpdateColumns: (columns: number) => void
  dropIndicator: DropIndicator
  isActive: boolean
  rowCount: number
}

const ColumnDroppable = ({ index, rowId }: { index: number; rowId: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${rowId}-column-${index}`,
    data: {
      columnIndex: index,
    },
  })

  return (
    <div key={index} className="col-span-1" ref={setNodeRef} data-column-index={index}>
      <div
        className={`border-2 border-dashed rounded-sm p-6 text-center text-muted-foreground transition-colors ${
          isOver ? 'bg-primary/5 border-primary/30' : ''
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
  onUpdateColumns,
  dropIndicator,
  isActive,
  rowCount,
}: FormRowComponentProps) {
  const { setNodeRef } = useDroppable({
    id: row.id,
  })

  const availableColumns = getAvailableColumnsInRow(row)

  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <Card
        ref={setNodeRef}
        className={`transition-all duration-200 ${
          isActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''
        }`}
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
              onClick={() => onUpdateColumns(Math.max(1, row.columns - 1))}
              disabled={row.columns <= 1}
              title="Diminuir colunas"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-5 text-center">{row.columns}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateColumns(Math.min(4, row.columns + 1))}
              disabled={row.columns >= 4}
              title="Aumentar colunas"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={onRemoveRow}
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
                <div key={component.id} className={`col-span-${component.columnSpan} relative`}>
                  {dropIndicator.isVisible &&
                    dropIndicator.rowIndex === rowIndex &&
                    dropIndicator.componentIndex === componentIndex &&
                    dropIndicator.position === 'before' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100%' }}
                        className="absolute -left-1.5 top-0 bottom-0 w-1.5 bg-purple-500 rounded-md z-10"
                        layoutId="dropIndicator"
                      />
                    )}
                  <SortableFormComponent
                    component={component}
                    onRemove={onRemoveComponent}
                    onUpdate={onUpdateComponent}
                    maxColumnSpan={row.columns}
                  />
                  {dropIndicator.isVisible &&
                    dropIndicator.rowIndex === rowIndex &&
                    dropIndicator.componentIndex === componentIndex &&
                    dropIndicator.position === 'after' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100%' }}
                        className="absolute -right-1.5 top-0 bottom-0 w-1.5 bg-purple-500 rounded-md z-10"
                        layoutId="dropIndicator"
                      />
                    )}
                </div>
              ) : (
                componentIndex + 1 <= row.columns && (
                  <div key={componentIndex} className="col-span-1 relative">
                    <ColumnDroppable key={componentIndex} index={componentIndex} rowId={row.id} />
                  </div>
                )
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
