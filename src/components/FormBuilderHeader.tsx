'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, ArrowLeft, Eye, Settings, LayoutGrid, Grid } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
interface FormBuilderHeaderProps {
  onSave?: () => void
  formName?: string
  setFormName?: (name: string) => void
  version: number
  isEditable: boolean
  hasBackButton?: boolean
  preview?: boolean
  hasRules?: boolean
}

export const FormBuilderHeader = ({
  onSave,
  formName,
  setFormName,
  version,
  isEditable,
  hasBackButton = false,
  preview = false,
  hasRules = false,
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

  const handleRules = () => {
    router.push(`/form-builder/rules`)
  }

  return (
    <>
      <div className="bg-[#253342] w-full min-h-[60px] flex items-center justify-between px-8 sticky top-0 z-10">
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
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-medium">Formulário</h1>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="flex min-w-32 items-center gap-2 rounded-sm px-2 py-2 text-gray-600 hover:bg-gray-100"
            >
              <Grid className="h-5 w-5" />
              Fluxo
            </Link>
            <Link
              href="#"
              className="flex min-w-32 items-center gap-2 rounded-sm px-2 py-2 text-gray-600 hover:bg-gray-100"
            >
              <LayoutGrid className="h-5 w-5" />
              Formulário
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasRules && (
            <Button
              onClick={handleRules}
              className="bg-purple-700 hover:bg-purple-800 text-white border-none rounded font-medium px-6"
            >
              <Settings className="w-5 h-5 mr-2" />
              Regras
            </Button>
          )}
          {preview && (
            <Button
              onClick={handlePreview}
              className="bg-purple-700 hover:bg-purple-800 text-white border-none rounded font-medium px-6"
            >
              <Eye className="w-5 h-5 mr-2" />
              Visualizar
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
