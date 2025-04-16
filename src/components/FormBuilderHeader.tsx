'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
interface FormBuilderHeaderProps {
  onSave?: () => void
  formName?: string
  setFormName?: (name: string) => void
  version: number
  isEditable: boolean
  hasBackButton?: boolean
  preview?: boolean
}

export const FormBuilderHeader = ({
  onSave,
  formName,
  setFormName,
  version,
  isEditable,
  hasBackButton = false,
  preview = false,
}: FormBuilderHeaderProps) => {
  const router = useRouter()
  const handleSave = () => {
    if (onSave) {
      onSave()
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handlePreview = () => {
    router.push(`/form-builder/preview`)
  }

  return (
    <div className="bg-[#253342] w-full h-[60px] flex items-center justify-between px-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">Versão</span>
        <div className="bg-purple-500/20 px-3 py-1 rounded text-white font-semibold text-sm flex items-center">
          {version}
        </div>
      </div>
      {isEditable && (
        <div className="flex-1 flex justify-center">
          <div className="max-w-[300px] w-full">
            <Input
              value={formName}
              onChange={(e) => setFormName?.(e.target.value)}
              className="bg-transparent border-none text-white text-xl font-semibold text-center focus-visible:ring-0"
              placeholder="Nome do Formulário"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        {hasBackButton && (
          <Button
            onClick={handleBack}
            className="border border-purple-500 bg-transparent hover:bg-purple-600  text-white rounded-sm font-medium px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        )}
        {preview && (
          <Button
            onClick={handlePreview}
            className="bg-purple-500 hover:bg-purple-600 text-white border-none rounded font-medium px-6"
          >
            <Eye className="w-5 h-5 mr-2" />
            Visualizar
          </Button>
        )}
        {isEditable && (
          <Button
            onClick={handleSave}
            className="bg-purple-500 hover:bg-purple-600 text-white border-none rounded font-medium px-6"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar
          </Button>
        )}
      </div>
    </div>
  )
}
