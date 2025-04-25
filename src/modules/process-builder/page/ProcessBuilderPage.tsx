'use client'
import { ContainerMain } from '@/components/ContainerMain'
import { Button } from '@/components/ui/button'
import { Workflow, File, Ruler } from 'lucide-react'
import { useState } from 'react'
import { FormBuilderPage } from '@/modules/process-builder/features/form/pages/FormBuilder'
import { WorkflowBuilderModule } from '@/modules/process-builder/features/workflow/WorkflowBuilderModule'
import { cn } from '@/lib/utils'
import { FormBuilderProvider } from '@/modules/form-builder2/contexts/FormBuilderContext'
import { ReactFlowProvider } from '@xyflow/react'
import { NodeSettingsProvider } from '../features/workflow/contexts/NodeSettingsContext'
import { WorkflowBuilderProvider } from '../features/workflow/contexts/WorkflowBuilderContext'

const tabs = [
  {
    label: 'Fluxo',
    icon: Workflow,
  },
  {
    label: 'Formulário',
    icon: File,
  },
]

export const ProcessBuilderPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <ContainerMain
      title="Criar Processo"
      subHeader={
        <div className="border-b p-2 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            className={cn(
              'border-none flex items-center gap-2',
              activeTab === tabs[0] && 'bg-purple-500 text-white',
            )}
            onClick={() => setActiveTab(tabs[0])}
          >
            <Workflow className="w-4 h-4" />
            Fluxo
          </Button>
          <Button
            variant="outline"
            className={cn(
              'border-none flex items-center gap-2',
              activeTab === tabs[1] && 'bg-purple-500 text-white',
            )}
            onClick={() => setActiveTab(tabs[1])}
          >
            <File className="w-4 h-4" />
            Formulário
          </Button>
          <Button variant="outline" className="border-none flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Regras
          </Button>
        </div>
      }
      className="p-0"
    >
      <FormBuilderProvider>
        <ReactFlowProvider>
          <NodeSettingsProvider>
            <WorkflowBuilderProvider>
              {activeTab.label === 'Fluxo' && <WorkflowBuilderModule />}
              {activeTab.label === 'Formulário' && <FormBuilderPage />}
            </WorkflowBuilderProvider>
          </NodeSettingsProvider>
        </ReactFlowProvider>
      </FormBuilderProvider>
    </ContainerMain>
  )
}
