'use client'

import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
  type DragMoveEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FormComponentPanel } from '../components/FormPanel'
import { FormCanvas } from '../components/FormCanvas'
import type { DropIndicator, FormComponent, FormComponentType } from '../types'
import { canAddComponentToRow, createComponent, getAvailableColumnsInRow } from '../utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFormBuilder } from '../contexts/FormBuilderContext'
import { ActiveTabForm } from '@/modules/process-builder/components/ProcessBuilderHeader'
import { ComponentConfigDialog } from '@/modules/process-builder/features/form/components/ComponentConfigDialog'


type FormBuilderPageProps = {
  activeTabForm: ActiveTabForm
}

export function FormBuilderPage({ activeTabForm }: FormBuilderPageProps) {
  const {
    rows,
    formName,
    setFormName,
    setRows,
    addRow,
    removeRow,
    removeRowColumns,
    addRowColumns,
    addFieldToRow,
    removeField,
  } = useFormBuilder()
  const [activeComponent, setActiveComponent] = useState<FormComponent | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator>({
    isVisible: false,
    rowIndex: 0,
    componentIndex: 0,
    position: 'before',
  })
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [dragOverRowId, setDragOverRowId] = useState<string | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [pendingComponent, setPendingComponent] = useState<{
    component: FormComponent | undefined
    columnIndex: number | undefined
  } | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { id, data } = event.active

    if (data.current?.type === 'component-panel') {
      const componentType = data.current.componentType as FormComponentType
      const newComponent = createComponent(componentType)
      setActiveComponent(newComponent)
    } else {
      // Encontrar o componente em todas as linhas
      for (const row of rows) {
        const component = row.components.find((c): c is FormComponent => c !== null && c.id === id)
        if (component) {
          setActiveComponent(component)
          break
        }
      }
    }
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    if (!over) {
      if (dropIndicator.isVisible) {
        setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
      }
      if (dragOverRowId) {
        setDragOverRowId(null)
      }
      if (isDraggingOver) {
        setIsDraggingOver(false)
      }
      return
    }

    // Verificar se estamos sobre uma linha
    const rowIndex = rows.findIndex((row) => row.id === over.id)
    if (rowIndex !== -1) {
      if (dragOverRowId !== rows[rowIndex].id) {
        setDragOverRowId(rows[rowIndex].id)
      }
      if (!isDraggingOver) {
        setIsDraggingOver(true)
      }

      // Se a linha estiver vazia, mostrar indicador no centro
      if (rows[rowIndex].components.length === 0) {
        if (!dropIndicator.isVisible || dropIndicator.rowIndex !== rowIndex) {
          setDropIndicator({
            isVisible: true,
            rowIndex,
            componentIndex: 0,
            position: 'before',
          })
        }
        return
      }

      // Se a linha não estiver vazia, verificar se há espaço
      if (active.data.current?.type === 'component-panel') {
        const componentType = active.data.current.componentType as FormComponentType
        const newComponent = createComponent(componentType)

        if (!canAddComponentToRow(rows[rowIndex], newComponent.columnSpan)) {
          if (dropIndicator.isVisible) {
            setDropIndicator({
              isVisible: false,
              rowIndex: 0,
              componentIndex: 0,
              position: 'before',
            })
          }
          return
        }
      }

      return
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      if (dragOverRowId !== row.id) {
        setDragOverRowId(row.id)
      }

      const componentIndex = row.components.findIndex(
        (c): c is FormComponent => c !== null && c.id === over.id,
      )
      if (componentIndex !== -1) {
        if (!isDraggingOver) {
          setIsDraggingOver(true)
        }

        // Verificar se over.rect existe
        if (!over.rect) {
          return
        }

        const overRect = over.rect
        const overCenter = overRect.top + overRect.height / 2
        const pointerY = (event.activatorEvent as MouseEvent).clientY

        // Determinar se estamos antes ou depois do componente
        const position = pointerY < overCenter ? 'before' : 'after'

        // Verificar se há espaço na linha para o novo componente
        if (active.data.current?.type === 'component-panel') {
          const componentType = active.data.current.componentType as FormComponentType
          const newComponent = createComponent(componentType)

          // Se não houver espaço suficiente, não mostrar o indicador
          if (!canAddComponentToRow(row, newComponent.columnSpan)) {
            if (dropIndicator.isVisible) {
              setDropIndicator({
                isVisible: false,
                rowIndex: 0,
                componentIndex: 0,
                position: 'before',
              })
            }
            return
          }
        }

        if (
          !dropIndicator.isVisible ||
          dropIndicator.rowIndex !== rowIndex ||
          dropIndicator.componentIndex !== componentIndex ||
          dropIndicator.position !== position
        ) {
          setDropIndicator({
            isVisible: true,
            rowIndex,
            componentIndex,
            position,
          })
        }
        return
      }
    }

    if (dropIndicator.isVisible) {
      setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveComponent(null)
    setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
    setIsDraggingOver(false)
    setDragOverRowId(null)

    if (!over) return

    if (active.data.current?.type === 'component-sortable') {
      const rowIndex = rows.findIndex((row) => row.id === over.data.current?.rowId)
      if (rowIndex === -1) return

      const row = rows[rowIndex]
      const sourceIndex = row.components.findIndex((component) => component?.id === active.id)
      const targetIndex = over.data.current?.columnIndex

      if (active.data.current.rowId !== over.data.current?.rowId) {
        const sourceRowActiveIndex = rows.findIndex((row) => row.id === active.data.current?.rowId)
        const sourceRowActiveComponentIndex = active.data.current.columnIndex

        const sourceRowOverIndex = rows.findIndex(
          (component) => component?.id === over.data.current?.rowId,
        )
        const sourceRowOverComponentIndex = over.data.current?.columnIndex

        const updatedRows = [...rows]
        const tempActive =
          updatedRows[sourceRowActiveIndex].components[sourceRowActiveComponentIndex]
        const tempOver = updatedRows[sourceRowOverIndex].components[targetIndex]

        updatedRows[sourceRowOverIndex].components[sourceRowOverComponentIndex] = tempActive
        updatedRows[sourceRowActiveIndex].components[sourceRowActiveComponentIndex] = tempOver
        setRows(updatedRows)
      }

      if (sourceIndex !== -1 && targetIndex !== undefined) {
        const updatedRows = [...rows]

        const temp = updatedRows[rowIndex].components[sourceIndex]

        updatedRows[rowIndex].components[sourceIndex] =
          updatedRows[rowIndex].components[targetIndex]
        updatedRows[rowIndex].components[targetIndex] = temp

        setRows(updatedRows)
      }
    }

    if (active.data.current?.type === 'component-panel') {
      if (over.data.current?.columnIndex !== undefined) {
        const componentType = active.data.current.componentType as FormComponentType
        const newComponent = createComponent(componentType)

        // Verificar se há espaço na linha
        const rowIndex = rows.findIndex((row) => row.id === over.data.current?.rowId)
        if (rowIndex !== -1) {
          const row = rows[rowIndex]
          const availableColumns = getAvailableColumnsInRow(row)

          if (availableColumns >= newComponent.columnSpan) {
            setPendingComponent({
              component: newComponent,
              columnIndex: over.data.current?.columnIndex,
            })
            setShowConfigModal(true)
            setDragOverRowId(over.data.current?.rowId)
          } else {
            toast.error('Não há espaço suficiente nesta linha para adicionar este componente.')
          }
        }
      }
    }
  }

  const handleUpdateComponent = (
    rowIndex: number,
    componentId: string,
    updates: Partial<FormComponent>,
  ) => {
    const updatedRows = [...rows]
    const componentIndex = updatedRows[rowIndex].components.findIndex(
      (c): c is FormComponent => c !== null && c.id === componentId,
    )

    if (componentIndex !== -1) {
      const existingComponent = updatedRows[rowIndex].components[componentIndex]
      if (existingComponent) {
        updatedRows[rowIndex].components[componentIndex] = {
          ...existingComponent,
          ...updates,
        } as FormComponent
      }
      setRows(updatedRows)
    }
  }

  const handleConfigSubmit = (component: FormComponent) => {
    if (!component) return

    const rowIndex = rows.findIndex((row) => row.id === dragOverRowId)
    if (rowIndex !== -1) {
      addFieldToRow(rowIndex, pendingComponent?.columnIndex!, component)
    }

    setShowConfigModal(false)
    setPendingComponent(null)

    toast.success('Campo adicionado com sucesso ao formulário.')
  }

  // Criar uma lista plana de IDs para o SortableContext
  const allComponentIds = rows.flatMap((row) =>
    row.components.filter((c): c is FormComponent => c !== null).map((c) => c.id),
  )
  const allRowIds = rows.map((row) => row.id)

  return (
    <>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100vh-64px)]">
          {/* Painel de componentes fixo */}
          <div className="w-64 fixed left-0 top-[133px] h-[calc(100vh-133px)] overflow-y-auto border-r bg-white">
            <FormComponentPanel />
          </div>

          {/* Área principal com scroll */}
          <div className="flex-1 ml-64">
            <div className="p-8 bg-gray-100  h-full">
              <div className="flex justify-between items-center mb-4">
                <Button
                  onClick={addRow}
                  className="gap-1 bg-purple-500 hover:bg-purple-600 text-white rounded-sm font-medium"
                >
                  <Plus className="h-4 w-4" /> Adicionar linha
                </Button>
              </div>

              <SortableContext
                items={[...allComponentIds, ...allRowIds]}
                strategy={verticalListSortingStrategy}
              >
                <FormCanvas
                  rows={rows}
                  onRemoveComponent={removeField}
                  onUpdateComponent={handleUpdateComponent}
                  onRemoveRow={removeRow}
                  onRemoveRowColumns={removeRowColumns}
                  onAddRowColumns={addRowColumns}
                  dropIndicator={dropIndicator}
                  dragOverRowId={dragOverRowId}
                />
              </SortableContext>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeComponent && (
            <div className="border rounded-md p-3 bg-white shadow-xl opacity-90 scale-105 transition-transform duration-200 w-48 -rotate-3 cursor-grabbing">
              <div className="font-medium">{activeComponent.type}</div>
              <div className="text-xs text-muted-foreground mt-1">Arraste para posicionar</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ComponentConfigDialog
        isOpen={showConfigModal}
        onOpenChange={setShowConfigModal}
        component={pendingComponent?.component}
        onConfigSubmit={handleConfigSubmit}
        onUpdateComponent={(component: any) => setPendingComponent((prev) => ({ ...prev!, component }))}
      />
    </>
  )
}
