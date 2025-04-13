'use client'

import React from 'react'
import { FormBuilderProvider, useFormBuilder } from './contexts/FormBuilderContext'
import { FormBuilderCanvas } from './components/FormBuilderCanvas'
import { FormBuilderSidebar } from './components/FormBuilderSidebar'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FormPreview } from '@/modules/form-builder/components/FormFieldPreview'

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

const FormBuilderModule: React.FC = () => {
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = React.useState(false)
  // const { selectedField } = useFormBuilder()

  const handleSave = (form: FormBuilderData) => {
    console.log('Form saved:', form)
    // Implementar lógica de salvamento
  }

  // React.useEffect(() => {
  //   if (selectedField) {
  //     setIsPropertiesModalOpen(true)
  //   }
  // }, [selectedField])

  return (
    <FormBuilderProvider>
      <FormBuilderHeader onSave={handleSave} />
      <div className="flex h-[calc(100vh-60px)] flex-1 w-full">
        <div className="w-72">
          <FormBuilderSidebar />
        </div>
        <FormBuilderCanvas />
        <FormPreview />
      </div>
    </FormBuilderProvider>
  )
}

export default FormBuilderModule
