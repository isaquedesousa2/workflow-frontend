'use client'
import { ContainerMain } from '@/components/ContainerMain'
import { Workflow, File } from 'lucide-react'
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
  ActiveTab,
  ActiveTabForm,
} from '@/modules/process-builder/components/ProcessBuilderHeader'
import { FormPreview } from '@/modules/process-builder/features/form/pages/FormPreview'

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
              {activeTab === 'flow' && <WorkflowBuilderModule />}
              {activeTab === 'form' && <FormContent activeTabForm={activeTabForm} />}
            </WorkflowBuilderProvider>
          </NodeSettingsProvider>
        </ReactFlowProvider>
      </FormBuilderProvider>
    </ContainerMain>
  )
}
