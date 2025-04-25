'use client'
import { toast } from '@/modules/form-builder2/hooks/use-toast'
import { FormComponent, FormComponentType, FormRow } from '@/modules/form-builder2/types'
import { createComponent, createRow } from '@/modules/form-builder2/utils'
import { createContext, useContext, useState } from 'react'

interface FormBuilderContextType {
  formName: string
  setFormName: (formName: string) => void
  rows: FormRow[]
  setRows: (rows: FormRow[]) => void
  addRow: () => void
  removeRow: (rowIndex: number) => void
  removeRowColumns: (rowIndex: number) => void
  addRowColumns: (rowIndex: number) => void
  addFieldToRow: (rowIndex: number, columnIndex: number, newComponent: FormComponent) => void
  removeField: (rowIndex: number, fieldId: string) => void
  updateComponent: (
    rowIndex: number,
    componentId: string,
    updates: Partial<Omit<FormComponent, 'id'>>,
  ) => void
}

export const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined)

export const FormBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [formName, setFormName] = useState('')
  const [rows, setRows] = useState<FormRow[]>([createRow(1)])

  const addRow = () => {
    setRows([...rows, createRow(1)])
    toast({
      title: 'Linha adicionada',
      description: 'Uma nova linha foi adicionada ao formulário',
      duration: 2000,
    })
  }

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) {
      toast({
        title: 'Não é possível remover',
        description: 'O formulário deve ter pelo menos uma linha',
        duration: 2000,
        variant: 'destructive',
      })
      return
    }

    const updatedRows = [...rows]
    updatedRows.splice(rowIndex, 1)
    setRows(updatedRows)

    toast({
      title: 'Linha removida',
      description: `A linha ${rowIndex + 1} foi removida do formulário`,
      duration: 2000,
      variant: 'destructive',
    })
    setRows(rows.filter((row) => row.id !== rows[rowIndex].id))
  }

  const removeRowColumns = (rowIndex: number) => {
    const row = rows[rowIndex]

    if (
      row.columns > 1 &&
      row.components.filter((component) => component === null).length > 0 &&
      row.columns
    ) {
      const updatedRows = [...rows]
      updatedRows[rowIndex].columns = row.columns - 1
      setRows(updatedRows)
    }
  }

  const addRowColumns = (rowIndex: number) => {
    const row = rows[rowIndex]

    if (row.columns < 4) {
      const updatedRows = [...rows]
      updatedRows[rowIndex].columns = row.columns + 1
      setRows(updatedRows)
    }
  }

  const addFieldToRow = (rowIndex: number, columnIndex: number, newComponent: FormComponent) => {
    const updatedRows = [...rows]

    if (rowIndex !== -1) {
      if (columnIndex >= 0 && columnIndex < updatedRows[rowIndex].components.length) {
        updatedRows[rowIndex].components[columnIndex] = newComponent
      } else {
        updatedRows[rowIndex].components.push(newComponent)
      }
      setRows(updatedRows)
    }
  }

  const removeField = (rowIndex: number, fieldId: string) => {
    const updatedRows = [...rows]
    const componentIndex = updatedRows[rowIndex].components.findIndex(
      (component) => component?.id === fieldId,
    )

    if (componentIndex !== -1) {
      updatedRows[rowIndex].components[componentIndex] = null
      setRows(updatedRows)

      toast({
        title: 'Componente removido',
        description: `O componente foi removido da linha ${rowIndex + 1}`,
        duration: 2000,
        variant: 'destructive',
      })
    }
  }

  const updateComponent = (
    rowIndex: number,
    componentId: string,
    updates: Partial<Omit<FormComponent, 'id'>>,
  ) => {
    const updatedRows = [...rows]
    const componentIndex = updatedRows[rowIndex].components.findIndex(
      (component) => component?.id === componentId,
    )

    if (componentIndex !== -1 && updatedRows[rowIndex].components[componentIndex]) {
      const existingComponent = updatedRows[rowIndex].components[componentIndex]!
      updatedRows[rowIndex].components[componentIndex] = {
        ...existingComponent,
        ...updates,
      }
      setRows(updatedRows)
    }
  }

  return (
    <FormBuilderContext.Provider
      value={{
        formName,
        setFormName,
        rows,
        setRows,
        addRow,
        removeRow,
        removeRowColumns,
        addRowColumns,
        addFieldToRow,
        removeField,
        updateComponent,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext)
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider')
  }
  return context
}
