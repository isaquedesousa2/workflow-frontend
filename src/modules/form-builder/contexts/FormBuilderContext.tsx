'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { FormField, FormRow } from '../types/form-builder'

interface FormBuilderContextType {
  formName: string
  setFormName: (formName: string) => void
  rows: FormRow[]
  activeField: string | null
  addRow: () => void
  removeRow: (rowId: string) => void
  updateRowColumns: (rowId: string, columnCount: number) => void
  addFieldToColumn: (rowId: string, columnId: string, field: Omit<FormField, 'id'>) => void
  removeField: (fieldId: string) => void
  moveField: (
    fieldId: string,
    sourceRowId: string,
    sourceColumnId: string,
    destinationRowId: string,
    destinationColumnId: string,
  ) => void
  reorderFields: (rowId: string, columnId: string, startIndex: number, endIndex: number) => void
  setActiveField: (fieldId: string | null) => void
  updateFieldProperties: (fieldId: string, properties: Partial<FormField>) => void
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined)

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<FormRow[]>([])
  const [activeField, setActiveField] = useState<string | null>(null)
  const [formName, setFormName] = useState<string>('')

  const addRow = () => {
    const newRow: FormRow = {
      id: uuidv4(),
      columns: [{ id: uuidv4(), fields: [] }],
    }
    setRows([...rows, newRow])
  }

  const removeRow = (rowId: string) => {
    setRows(rows.filter((row) => row.id !== rowId))
  }

  const updateRowColumns = (rowId: string, columnCount: number) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          // Ensure we have exactly columnCount columns
          const currentColumnCount = row.columns.length

          if (columnCount > currentColumnCount) {
            // Add more columns
            const newColumns = Array.from({ length: columnCount - currentColumnCount }, () => ({
              id: uuidv4(),
              fields: [],
            }))
            return { ...row, columns: [...row.columns, ...newColumns] }
          } else if (columnCount < currentColumnCount) {
            // Remove columns and move their fields to the first column
            const columnsToKeep = row.columns.slice(0, columnCount)
            const columnsToRemove = row.columns.slice(columnCount)

            const fieldsToMove = columnsToRemove.flatMap((col) => col.fields)

            if (columnsToKeep.length > 0 && fieldsToMove.length > 0) {
              columnsToKeep[0].fields = [...columnsToKeep[0].fields, ...fieldsToMove]
            }

            return { ...row, columns: columnsToKeep }
          }
        }
        return row
      }),
    )
  }

  const addFieldToColumn = (rowId: string, columnId: string, field: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      ...field,
      id: uuidv4(),
    }

    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  fields: [...column.fields, newField],
                }
              }
              return column
            }),
          }
        }
        return row
      }),
    )
  }

  const removeField = (fieldId: string) => {
    setRows(
      rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          fields: column.fields.filter((field) => field.id !== fieldId),
        })),
      })),
    )

    // Se o campo removido for o ativo, limpe o campo ativo
    if (activeField === fieldId) {
      setActiveField(null)
    }
  }

  const moveField = (
    fieldId: string,
    sourceRowId: string,
    sourceColumnId: string,
    destinationRowId: string,
    destinationColumnId: string,
  ) => {
    // Find the field to move
    let fieldToMove: FormField | null = null

    setRows((prevRows) => {
      // First, find and remove the field from its source
      const updatedRows = prevRows.map((row) => {
        if (row.id === sourceRowId) {
          return {
            ...row,
            columns: row.columns.map((column) => {
              if (column.id === sourceColumnId) {
                const fieldIndex = column.fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                  fieldToMove = column.fields[fieldIndex]
                  return {
                    ...column,
                    fields: column.fields.filter((f) => f.id !== fieldId),
                  }
                }
              }
              return column
            }),
          }
        }
        return row
      })

      // Then, add the field to its destination
      if (fieldToMove) {
        return updatedRows.map((row) => {
          if (row.id === destinationRowId) {
            return {
              ...row,
              columns: row.columns.map((column) => {
                if (column.id === destinationColumnId) {
                  return {
                    ...column,
                    fields: [...column.fields, fieldToMove!],
                  }
                }
                return column
              }),
            }
          }
          return row
        })
      }

      return updatedRows
    })
  }

  const reorderFields = (rowId: string, columnId: string, startIndex: number, endIndex: number) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map((column) => {
              if (column.id === columnId) {
                const newFields = [...column.fields]
                const [movedField] = newFields.splice(startIndex, 1)
                newFields.splice(endIndex, 0, movedField)
                return { ...column, fields: newFields }
              }
              return column
            }),
          }
        }
        return row
      }),
    )
  }

  const updateFieldProperties = (fieldId: string, properties: Partial<FormField>) => {
    setRows(
      rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          fields: column.fields.map((field) =>
            field.id === fieldId ? { ...field, ...properties } : field,
          ),
        })),
      })),
    )
  }

  return (
    <FormBuilderContext.Provider
      value={{
        formName,
        rows,
        activeField,
        setFormName,
        addRow,
        removeRow,
        updateRowColumns,
        addFieldToColumn,
        removeField,
        moveField,
        reorderFields,
        setActiveField,
        updateFieldProperties,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext)
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider')
  }
  return context
}
