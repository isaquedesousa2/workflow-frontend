'use client'
import { FormField } from '@/modules/form-builder/types/form-builder'
import { toast } from '@/modules/form-builder2/hooks/use-toast'
import { FormRow } from '@/modules/form-builder2/types'
import { createRow } from '@/modules/form-builder2/utils'
import { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface FormBuilderContextType {
  formName: string
  setFormName: (formName: string) => void
  rows: FormRow[]
  setRows: (rows: FormRow[]) => void
  addRow: () => void
  removeRow: (rowIndex: number) => void
  updateRowColumns: (rowIndex: number, columnCount: number) => void
  addFieldToRow: (rowIndex: number, columnId: string, field: Omit<FormField, 'id'>) => void
  removeField: (rowIndex: number, fieldId: string) => void
}

export const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined)

export const FormBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [formName, setFormName] = useState('')
  const [rows, setRows] = useState<FormRow[]>([])

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

  const updateRowColumns = (rowIndex: number, columnCount: number) => {
    const row = rows[rowIndex]

    if (row.columns === columnCount) {
      toast({
        title: 'Não é possível atualizar',
        description: 'A linha já tem o número de colunas desejado',
        duration: 2000,
      })
      return
    }

    if (columnCount < row.components.length) {
      toast({
        title: 'Não é possível atualizar',
        description: 'O número de colunas não pode ser menor que o número de componentes',
        duration: 2000,
      })
      return
    }

    setRows(
      rows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, columns: columnCount }
        }
        return row
      }),
    )

    toast({
      title: 'Linha atualizada',
      description: `A linha ${rowIndex + 1} agora tem ${columnCount} colunas`,
      duration: 2000,
    })
  }

  const addFieldToRow = (rowIndex: number, columnId: string, field: Omit<FormField, 'id'>) => {
    setRows(
      rows.map((row) => {
        if (row.id === rows[rowIndex].id) {
          const columnIndex = row.components.findIndex((col) => col.id === columnId)
          if (columnIndex !== -1) {
            row.components[columnIndex].fields.push({ ...field, id: uuidv4() })
          }
        }
        return row
      }),
    )
  }

  const removeField = (rowIndex: number, fieldId: string) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex].components = updatedRows[rowIndex].components.filter(
      (component) => component.id !== fieldId,
    )
    setRows(updatedRows)

    toast({
      title: 'Componente removido',
      description: `O componente foi removido da linha ${rowIndex + 1}`,
      duration: 2000,
      variant: 'destructive',
    })
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
        updateRowColumns,
        addFieldToRow,
        removeField,
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
