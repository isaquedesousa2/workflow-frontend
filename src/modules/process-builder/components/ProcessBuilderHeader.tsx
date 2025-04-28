'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, LayoutGrid, Workflow, Settings } from 'lucide-react'
import { useProcessBuilder } from '../contexts/ProcessBuilderContext'
import { cn } from '@/lib/utils'

export type ActiveTab = 'flow' | 'form' | 'settings'
export type ActiveTabForm = 'builder' | 'preview'

interface ProcessBuilderHeaderProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  activeTabForm: ActiveTabForm
  setActiveTabForm: (tab: ActiveTabForm) => void
  onSave?: () => void
}

export const ProcessBuilderHeader = ({
  activeTab,
  setActiveTab,
  activeTabForm,
  setActiveTabForm,
  onSave,
}: ProcessBuilderHeaderProps) => {
  const { name, setName } = useProcessBuilder()

  return (
    <>
      <div className="bg-[#253342] w-full min-h-[60px] flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">Versão</span>
          <div className="bg-purple-500/20 px-3 py-1 rounded text-white font-semibold text-sm flex items-center">
            1
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="max-w-[300px] w-full">
            <Input
              value={name}
              onChange={(e) => setName?.(e.target.value)}
              className="bg-transparent border-none text-white text-xl font-semibold text-center focus-visible:ring-0"
              placeholder="Nome do Processo"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onSave}
            className="hover:bg-purple-600 text-white border-none rounded-sm font-medium px-6 bg-transparent"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-md font-medium w-[100px]">
            {activeTab === 'form' ? 'Formulário' : activeTab === 'flow' ? 'Fluxo' : 'Configurações'}
          </h1>
          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Button
              onClick={() => activeTab !== 'flow' && setActiveTab('flow')}
              className={cn(
                'text-sm flex min-w-24 items-center gap-2 rounded-sm px-2 py-2 bg-transparent text-gray-600 hover:bg-gray-100',
                activeTab === 'flow' && 'bg-purple-600 text-white hover:bg-purple-600',
              )}
            >
              <Workflow className="h-5 w-5" />
              Fluxo
            </Button>
            <Button
              onClick={() => activeTab !== 'form' && setActiveTab('form')}
              className={cn(
                'text-sm flex min-w-24 items-center gap-2 rounded-sm px-2 py-2 bg-transparent text-gray-600 hover:bg-gray-100',
                activeTab === 'form' && 'bg-purple-600 text-white hover:bg-purple-600',
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              Formulário
            </Button>
            <Button
              onClick={() => activeTab !== 'settings' && setActiveTab('settings')}
              className={cn(
                'text-sm flex min-w-24 items-center gap-2 rounded-sm px-2 py-2 bg-transparent text-gray-600 hover:bg-gray-100',
                activeTab === 'settings' && 'bg-purple-600 text-white hover:bg-purple-600',
              )}
            >
              <Settings className="h-5 w-5" />
              Configurações
            </Button>
          </div>
        </div>
        {activeTab === 'form' && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveTabForm('builder')}
              className={cn(
                'text-sm flex min-w-24 items-center gap-2 rounded-sm px-2 py-2 bg-transparent text-gray-600 hover:bg-gray-100',
                activeTabForm === 'builder' && 'bg-purple-600 text-white hover:bg-purple-600',
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              Editor
            </Button>
            <Button
              onClick={() => setActiveTabForm('preview')}
              className={cn(
                'text-sm flex min-w-24 items-center gap-2 rounded-sm px-2 py-2 bg-transparent text-gray-600 hover:bg-gray-100',
                activeTabForm === 'preview' && 'bg-purple-600 text-white hover:bg-purple-600',
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              Pré-visualização
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
