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
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FormComponentPanel } from '../components/FormPanel'
import { FormCanvas } from '../components/FormCanvas'
import type { DropIndicator, FormComponent, FormComponentType } from '../types'
import { canAddComponentToRow, createComponent } from '../utils'
import { useToast } from '../hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFormBuilder } from '@/modules/form-builder2/contexts/FormBuilderContext'
import { FormBuilderHeader } from '@/components/FormBuilderHeader'
import { ContainerMain } from '@/components/ContainerMain'

export function FormBuilderPage() {
  const { formName, setFormName } = useFormBuilder()
  const { rows, setRows, addRow, removeRow, updateRowColumns, addFieldToRow, removeField } =
    useFormBuilder()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeComponent, setActiveComponent] = useState<FormComponent | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator>({
    isVisible: false,
    rowIndex: 0,
    componentIndex: 0,
    position: 'before',
  })
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [dragOverRowId, setDragOverRowId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDragStart = (event: DragStartEvent) => {
    const { id, data } = event.active
    setActiveId(id.toString())

    if (data.current?.type === 'component-panel') {
      const componentType = data.current.componentType as FormComponentType
      const newComponent = createComponent(componentType)
      setActiveComponent(newComponent)
    } else {
      // Encontrar o componente em todas as linhas
      for (const row of rows) {
        const component = row.components.find((c) => c.id === id)
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
      setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
      setDragOverRowId(null)
      setIsDraggingOver(false)
      return
    }

    // Verificar se estamos sobre uma linha
    const rowIndex = rows.findIndex((row) => row.id === over.id)
    if (rowIndex !== -1) {
      setDragOverRowId(rows[rowIndex].id)
      setIsDraggingOver(true)

      // Se a linha estiver vazia, mostrar indicador no centro
      if (rows[rowIndex].components.length === 0) {
        setDropIndicator({
          isVisible: true,
          rowIndex,
          componentIndex: 0,
          position: 'before',
        })
        return
      }

      // Se a linha não estiver vazia, verificar se há espaço
      if (active.data.current?.type === 'component-panel') {
        const componentType = active.data.current.componentType as FormComponentType
        const newComponent = createComponent(componentType)

        if (!canAddComponentToRow(rows[rowIndex], newComponent.columnSpan)) {
          // Não há espaço suficiente na linha
          setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
          return
        }
      }

      return
    }

    // Verificar se estamos sobre um componente
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      setDragOverRowId(row.id)

      const componentIndex = row.components.findIndex((c) => c.id === over.id)
      if (componentIndex !== -1) {
        setIsDraggingOver(true)

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
            setDropIndicator({
              isVisible: false,
              rowIndex: 0,
              componentIndex: 0,
              position: 'before',
            })
            return
          }
        }

        setDropIndicator({
          isVisible: true,
          rowIndex,
          componentIndex,
          position,
        })
        return
      }
    }

    setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setActiveComponent(null)
    setDropIndicator({ isVisible: false, rowIndex: 0, componentIndex: 0, position: 'before' })
    setIsDraggingOver(false)
    setDragOverRowId(null)

    // Se não houver um destino válido, não faça nada
    if (!over) return

    // Handle dropping a new component from the panel
    if (active.data.current?.type === 'component-panel') {
      const componentType = active.data.current.componentType as FormComponentType
      const newComponent = createComponent(componentType)

      // Verificar se estamos sobre uma linha
      const rowIndex = rows.findIndex((row) => row.id === over.id)
      if (rowIndex !== -1) {
        // Verificar se há espaço na linha
        if (canAddComponentToRow(rows[rowIndex], newComponent.columnSpan)) {
          const updatedRows = [...rows]
          updatedRows[rowIndex].components.push(newComponent)
          setRows(updatedRows)

          toast({
            title: 'Componente adicionado',
            description: `${newComponent.type} foi adicionado à linha ${rowIndex + 1}`,
            duration: 2000,
          })
        } else {
          toast({
            title: 'Não foi possível adicionar',
            description: `Não há espaço suficiente na linha ${rowIndex + 1}`,
            duration: 2000,
            variant: 'destructive',
          })
        }
        return
      }

      // Verificar se estamos sobre um componente
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]
        const componentIndex = row.components.findIndex((c) => c.id === over.id)

        if (componentIndex !== -1) {
          // Verificar se há espaço na linha
          if (!canAddComponentToRow(row, newComponent.columnSpan)) {
            toast({
              title: 'Não foi possível adicionar',
              description: `Não há espaço suficiente na linha ${rowIndex + 1}`,
              duration: 2000,
              variant: 'destructive',
            })
            return
          }

          // Verificar se over.rect existe
          if (!over.rect) {
            // Se não existir, adicionar ao final
            const updatedRows = [...rows]
            updatedRows[rowIndex].components.push(newComponent)
            setRows(updatedRows)
            return
          }

          const overRect = over.rect
          const overCenter = overRect.top + overRect.height / 2
          const pointerY = (event.activatorEvent as MouseEvent).clientY

          // Determinar se estamos antes ou depois do componente
          const position = pointerY < overCenter ? 'before' : 'after'
          const insertIndex = position === 'before' ? componentIndex : componentIndex + 1

          const updatedRows = [...rows]
          updatedRows[rowIndex].components.splice(insertIndex, 0, newComponent)
          setRows(updatedRows)

          toast({
            title: 'Componente adicionado',
            description: `${newComponent.type} foi adicionado à linha ${rowIndex + 1}`,
            duration: 2000,
          })
          return
        }
      }
    }
    // Handle reordering existing components
    else {
      // Encontrar o componente em todas as linhas
      let sourceRowIndex = -1
      let sourceComponentIndex = -1

      for (let i = 0; i < rows.length; i++) {
        const componentIndex = rows[i].components.findIndex((c) => c.id === active.id)
        if (componentIndex !== -1) {
          sourceRowIndex = i
          sourceComponentIndex = componentIndex
          break
        }
      }

      if (sourceRowIndex === -1) return // Componente não encontrado

      const component = rows[sourceRowIndex].components[sourceComponentIndex]

      // Verificar se estamos sobre uma linha
      const targetRowIndex = rows.findIndex((row) => row.id === over.id)
      if (targetRowIndex !== -1) {
        // Verificar se há espaço na linha de destino
        if (canAddComponentToRow(rows[targetRowIndex], component.columnSpan)) {
          // Remover da linha de origem
          const updatedRows = [...rows]
          updatedRows[sourceRowIndex].components.splice(sourceComponentIndex, 1)

          // Adicionar à linha de destino
          updatedRows[targetRowIndex].components.push(component)

          setRows(updatedRows)

          toast({
            title: 'Componente movido',
            description: `${component.type} foi movido para a linha ${targetRowIndex + 1}`,
            duration: 2000,
          })
        } else {
          toast({
            title: 'Não foi possível mover',
            description: `Não há espaço suficiente na linha ${targetRowIndex + 1}`,
            duration: 2000,
            variant: 'destructive',
          })
        }
        return
      }

      // Verificar se estamos sobre um componente
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]
        const targetComponentIndex = row.components.findIndex((c) => c.id === over.id)

        if (targetComponentIndex !== -1) {
          // Se estamos na mesma linha, apenas reordenar
          if (rowIndex === sourceRowIndex) {
            const updatedRows = [...rows]
            updatedRows[rowIndex].components = arrayMove(
              updatedRows[rowIndex].components,
              sourceComponentIndex,
              targetComponentIndex,
            )
            setRows(updatedRows)

            toast({
              title: 'Componente reordenado',
              description: 'A ordem dos componentes foi atualizada',
              duration: 2000,
            })
          } else {
            // Verificar se há espaço na linha de destino
            if (!canAddComponentToRow(row, component.columnSpan)) {
              toast({
                title: 'Não foi possível mover',
                description: `Não há espaço suficiente na linha ${rowIndex + 1}`,
                duration: 2000,
                variant: 'destructive',
              })
              return
            }

            // Verificar se over.rect existe
            if (!over.rect) {
              // Se não existir, adicionar ao final da linha
              const updatedRows = [...rows]
              updatedRows[sourceRowIndex].components.splice(sourceComponentIndex, 1)
              updatedRows[rowIndex].components.push(component)
              setRows(updatedRows)
              return
            }

            const overRect = over.rect
            const overCenter = overRect.top + overRect.height / 2
            const pointerY = (event.activatorEvent as MouseEvent).clientY

            // Determinar se estamos antes ou depois do componente
            const position = pointerY < overCenter ? 'before' : 'after'
            const insertIndex =
              position === 'before' ? targetComponentIndex : targetComponentIndex + 1

            const updatedRows = [...rows]
            // Remover da linha de origem
            updatedRows[sourceRowIndex].components.splice(sourceComponentIndex, 1)
            // Adicionar à linha de destino
            updatedRows[rowIndex].components.splice(insertIndex, 0, component)

            setRows(updatedRows)

            toast({
              title: 'Componente movido',
              description: `${component.type} foi movido para a linha ${rowIndex + 1}`,
              duration: 2000,
            })
            return
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
    const componentIndex = updatedRows[rowIndex].components.findIndex((c) => c.id === componentId)

    if (componentIndex !== -1) {
      updatedRows[rowIndex].components[componentIndex] = {
        ...updatedRows[rowIndex].components[componentIndex],
        ...updates,
      }
      setRows(updatedRows)
    }
  }

  // Criar uma lista plana de IDs para o SortableContext
  const allComponentIds = rows.flatMap((row) => row.components.map((c) => c.id))
  const allRowIds = rows.map((row) => row.id)

  return (
    <ContainerMain
      header={
        <FormBuilderHeader
          formName={formName}
          setFormName={setFormName}
          version={1}
          isEditable={false}
          hasBackButton={true}
        />
      }
    >
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-120px)]">
          <div className="md:col-span-3 p-4 overflow-y-auto">
            {/* <h2 className="text-xl font-semibold mb-4">Componentes</h2> */}
            <FormComponentPanel />
          </div>

          <div className="md:col-span-9 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-semibold">Canvas</h2> */}
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
                onUpdateRowColumns={updateRowColumns}
                dropIndicator={dropIndicator}
                isDraggingOver={isDraggingOver}
                dragOverRowId={dragOverRowId}
              />
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeComponent && (
            <div className="border rounded-md p-3 bg-white shadow-xl opacity-90 scale-105 transition-transform duration-200 w-48">
              <div className="font-medium">{activeComponent.type}</div>
              <div className="text-xs text-muted-foreground mt-1">Arraste para posicionar</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </ContainerMain>
  )
}
