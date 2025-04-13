'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { FormField, FormLayout, FormRow } from '../types/form.types'

interface FormBuilderContextData {
  layout: FormLayout
  formName: string
  selectedField: FormField | null
  selectedRow: FormRow | null
  setFormName: (name: string) => void
  addRow: (row: FormRow) => void
  addField: (rowId: string, field: FormField) => void
  updateField: (rowId: string, field: FormField) => void
  removeField: (rowId: string, fieldId: string) => void
  removeRow: (rowId: string) => void
  updateRow: (row: FormRow) => void
  reorderRows: (oldIndex: number, newIndex: number) => void
  moveField: (fromRow: string, toRow: string, fieldId: string) => void
  selectField: (field: FormField | null) => void
  selectRow: (row: FormRow | null) => void
}

const FormBuilderContext = createContext<FormBuilderContextData>({} as FormBuilderContextData)

export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<FormLayout>({ rows: [] })
  const [formName, setFormName] = useState('')
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [selectedRow, setSelectedRow] = useState<FormRow | null>(null)

  const addRow = useCallback((row: FormRow) => {
    setLayout((prev) => ({
      ...prev,
      rows: [...prev.rows, row],
    }))
  }, [])

  const addField = useCallback((rowId: string, field: FormField) => {
    setLayout((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              fields: [...row.fields, field],
            }
          : row,
      ),
    }))
  }, [])

  const updateField = useCallback((rowId: string, field: FormField) => {
    setLayout((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              fields: row.fields.map((f) => (f.id === field.id ? field : f)),
            }
          : row,
      ),
    }))
  }, [])

  const removeField = useCallback((rowId: string, fieldId: string) => {
    setLayout((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              fields: row.fields.filter((f) => f.id !== fieldId),
            }
          : row,
      ),
    }))
  }, [])

  const removeRow = useCallback((rowId: string) => {
    setLayout((prev) => ({
      ...prev,
      rows: prev.rows.filter((row) => row.id !== rowId),
    }))
  }, [])

  const updateRow = useCallback((updatedRow: FormRow) => {
    setLayout((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
    }))
  }, [])

  const reorderRows = useCallback((oldIndex: number, newIndex: number) => {
    setLayout((prev) => {
      const rows = [...prev.rows]
      const [removed] = rows.splice(oldIndex, 1)
      rows.splice(newIndex, 0, removed)
      return { ...prev, rows }
    })
  }, [])

  const moveField = useCallback(
    (fromRow: string, toRow: string, fieldId: string) => {
      const field = layout.rows.find((r) => r.id === fromRow)?.fields.find((f) => f.id === fieldId)

      if (field) {
        removeField(fromRow, fieldId)
        addField(toRow, field)
      }
    },
    [layout, removeField, addField],
  )

  return (
    <FormBuilderContext.Provider
      value={{
        layout,
        formName,
        selectedField,
        selectedRow,
        setFormName,
        addRow,
        addField,
        updateField,
        removeField,
        removeRow,
        updateRow,
        reorderRows,
        moveField,
        selectField: setSelectedField,
        selectRow: setSelectedRow,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}

export const useFormBuilder = () => useContext(FormBuilderContext)
