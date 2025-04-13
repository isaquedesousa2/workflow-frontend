'use client'

import React from 'react'
import { FormBuilderProvider, useFormBuilder } from './contexts/FormBuilderContext'
import FormBuilderCanvas from './components/FormBuilderCanvas'
import { FieldProperties } from './components/FieldProperties'
import { ComponentSidebar } from './components/ComponentSidebar'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface FormBuilderData {
  name: string
  sections: any[]
}

interface FormBuilderHeaderProps {
  onSave?: (form: FormBuilderData) => void
}

const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({ onSave }) => {
  const { layout, formName, setFormName } = useFormBuilder()

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: formName,
        sections: layout.sections,
      })
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

const FormBuilderModule: React.FC = () => {
  const handleSave = (form: FormBuilderData) => {
    console.log('Form saved:', form)
    // Implementar lógica de salvamento
  }

  return (
    <FormBuilderProvider>
      <div className="flex flex-col h-screen">
        <FormBuilderHeader onSave={handleSave} />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r">
            <ComponentSidebar />
          </div>
          <div className="flex-1 overflow-auto">
            <FormBuilderCanvas />
          </div>
          <div className="w-80 border-l">
            <FieldProperties />
          </div>
        </div>
      </div>
    </FormBuilderProvider>
  )
}

export default FormBuilderModule
