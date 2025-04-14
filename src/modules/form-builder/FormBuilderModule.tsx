'use client'

import React from 'react'
import { FormBuilderProvider, useFormBuilder } from './contexts/FormBuilderContext'
import { FormBuilderCanvas } from './components/FormBuilderCanvas'
import { FormBuilderSidebar } from './components/FormBuilderSidebar'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FormPreview } from '@/modules/form-builder/components/FormFieldPreview'
import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import type { FormField } from './types/form-builder'

interface FormBuilderData {
  name: string
  sections: any[]
}

interface FormBuilderHeaderProps {
  onSave?: (form: FormBuilderData) => void
}

const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({ onSave }) => {
  const { formName, setFormName } = useFormBuilder()

  const handleSave = () => {
    if (onSave) {
      // onSave({
      //   name: formName
      // })
    }
  }

  return (
    <div className="bg-[#253342] w-full h-[60px] flex items-center px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">Versão</span>
        <div className="bg-purple-500/20 px-3 py-1 rounded text-white font-semibold text-sm flex items-center">
          1
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="max-w-[300px] w-full">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="bg-transparent border-none text-white text-xl font-semibold text-center focus-visible:ring-0"
            placeholder="Nome do Formulário"
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        className="bg-purple-500 hover:bg-purple-600 text-white border-none rounded font-medium px-6"
      >
        <Save className="w-5 h-5 mr-2" />
        Salvar
      </Button>
    </div>
  )
}

const FormBuilderContent: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([])
  const { addRow, addFieldToColumn } = useFormBuilder()

  const handleDragEnd = (event: any) => {
    const { over, active } = event
    if (!over) return

    if (active.data?.current?.type === 'FIELD') {
      const newField = {
        id: crypto.randomUUID(),
        type: active.data.current.fieldType,
        name: active.data.current.fieldType,
        label: active.data.current.label,
      }

      if (over.id === 'canvas') {
        // Se soltar no canvas, adiciona uma nova linha
        setFormFields([...formFields, newField])
        addRow()
      } else if (over.data?.current?.type === 'COLUMN') {
        // Se soltar em uma coluna, adiciona o campo na coluna
        const { rowId, columnId } = over.data.current
        addFieldToColumn(rowId, columnId, newField)
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <FormBuilderHeader />
      <div className="flex h-[calc(100vh-60px)] flex-1 w-full">
        <div className="w-72">
          <FormBuilderSidebar />
        </div>
        <FormBuilderCanvas formFields={formFields} />
        <FormPreview />
      </div>
    </DndContext>
  )
}

const FormBuilderModule: React.FC = () => {
  return (
    <FormBuilderProvider>
      <FormBuilderContent />
    </FormBuilderProvider>
  )
}

export default FormBuilderModule
