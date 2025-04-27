'use client'
import { ContainerMain } from '@/components/ContainerMain'
import { Workflow, File, Settings } from 'lucide-react'
import { useState } from 'react'
import { FormBuilderPage } from '@/modules/process-builder/features/form/pages/FormBuilder'
import { WorkflowBuilderModule } from '@/modules/process-builder/features/workflow/WorkflowBuilderModule'
import {
  FormBuilderProvider,
  useFormBuilder,
} from '@/modules/process-builder/features/form/contexts/FormBuilderContext'
import { ReactFlowProvider } from '@xyflow/react'
import { NodeSettingsProvider } from '../features/workflow/contexts/NodeSettingsContext'
import { WorkflowBuilderProvider } from '../features/workflow/contexts/WorkflowBuilderContext'
import {
  ProcessBuilderHeader,
  ActiveTab as ProcessBuilderHeaderActiveTab,
  ActiveTabForm,
} from '@/modules/process-builder/components/ProcessBuilderHeader'
import { FormPreview } from '@/modules/process-builder/features/form/components/FormPreview'
import { FormValidationManager } from '@/modules/process-builder/features/form-validation/components/FormValidationManager'
import { FormValidationProvider } from '@/modules/process-builder/features/form-validation/contexts/FormValidationContext'

type ActiveTab = 'flow' | 'form' | 'settings'

const tabs = [
  {
    label: 'Fluxo',
    icon: Workflow,
  },
  {
    label: 'Formulário',
    icon: File,
  },
  {
    label: 'Configurações',
    icon: Settings,
  },
]

const FormContent = ({ activeTabForm }: { activeTabForm: ActiveTabForm }) => {
  const { rows } = useFormBuilder()

  return (
    <>
      {activeTabForm === 'builder' && <FormBuilderPage activeTabForm={activeTabForm} />}
      {activeTabForm === 'preview' && <FormPreview />}
    </>
  )
}

export const ProcessBuilderPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('flow')
  const [activeTabForm, setActiveTabForm] = useState<ActiveTabForm>('builder')

  return (
    <ContainerMain
      title="Criar Processo"
      header={
        <ProcessBuilderHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabForm={activeTabForm}
          setActiveTabForm={setActiveTabForm}
        />
      }
      className="p-0"
    >
      <FormBuilderProvider>
        <ReactFlowProvider>
          <NodeSettingsProvider>
            <WorkflowBuilderProvider>
              <FormValidationProvider>
                {activeTab === 'flow' && <WorkflowBuilderModule />}
                {activeTab === 'form' && <FormContent activeTabForm={activeTabForm} />}
                {activeTab === 'settings' && (
                  <FormValidationManager
                    formComponents={[]}
                    node={{ id: 'settings', type: 'settings', position: { x: 0, y: 0 }, data: {} }}
                  />
                )}
              </FormValidationProvider>
            </WorkflowBuilderProvider>
          </NodeSettingsProvider>
        </ReactFlowProvider>
      </FormBuilderProvider>
    </ContainerMain>
  )
}
