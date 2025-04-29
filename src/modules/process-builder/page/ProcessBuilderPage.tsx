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
import {
  WorkflowBuilderProvider,
  useWorkflowBuilder,
} from '../features/workflow/contexts/WorkflowBuilderContext'
import {
  ProcessBuilderHeader,
  ActiveTab as ProcessBuilderHeaderActiveTab,
  ActiveTabForm,
} from '@/modules/process-builder/components/ProcessBuilderHeader'
import { FormPreview } from '@/modules/process-builder/features/form/components/FormPreview'
import { FormValidationManager } from '@/modules/process-builder/features/form-validation/components/FormValidationManager'
import {
  FormValidationProvider,
  useFormValidation,
} from '@/modules/process-builder/features/form-validation/contexts/FormValidationContext'

type ActiveTab = 'flow' | 'form' | 'settings'

const FormContent = ({ activeTabForm }: { activeTabForm: ActiveTabForm }) => {
  const { rows } = useFormBuilder()

  return (
    <>
      {activeTabForm === 'builder' && <FormBuilderPage activeTabForm={activeTabForm} />}
      {activeTabForm === 'preview' && <FormPreview />}
    </>
  )
}

const ProcessBuilderPageContent = ({
  activeTab,
  setActiveTab,
  activeTabForm,
  setActiveTabForm,
  openConditionalDialog,
  setOpenConditionalDialog,
}: {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  activeTabForm: ActiveTabForm
  setActiveTabForm: (tab: ActiveTabForm) => void
  openConditionalDialog: boolean
  setOpenConditionalDialog: (open: boolean) => void
}) => {
  const { nodes, edges, processName } = useWorkflowBuilder()
  const { rows, formName } = useFormBuilder()
  const { state: validationState } = useFormValidation()
  const handleSave = () => {
    const data = {
      workflow: {
        name: processName,
        nodes,
        edges,
      },
      form: {
        name: formName,
        rows,
      },
      validations: validationState.validations,
    }
    console.log('JSON para salvar:', data)
    alert('JSON gerado! Veja o console.')
  }

  return (
    <ContainerMain
      header={
        <ProcessBuilderHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabForm={activeTabForm}
          setActiveTabForm={setActiveTabForm}
          onSave={handleSave}
          openConditionalDialog={openConditionalDialog}
          setOpenConditionalDialog={setOpenConditionalDialog}
        />
      }
      title="Criar Processo"
      className="p-0"
    >
      {activeTab === 'flow' && <WorkflowBuilderModule />}
      {activeTab === 'form' && <FormContent activeTabForm={activeTabForm} />}
      {activeTab === 'settings' && (
        <FormValidationManager
          openConditionalDialog={openConditionalDialog}
          setOpenConditionalDialog={setOpenConditionalDialog}
        />
      )}
    </ContainerMain>
  )
}

export const ProcessBuilderPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('flow')
  const [activeTabForm, setActiveTabForm] = useState<ActiveTabForm>('builder')
  const [openConditionalDialog, setOpenConditionalDialog] = useState(false)
  return (
    <FormBuilderProvider>
      <ReactFlowProvider>
        <NodeSettingsProvider>
          <WorkflowBuilderProvider>
            <FormValidationProvider>
              <ProcessBuilderPageContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeTabForm={activeTabForm}
                setActiveTabForm={setActiveTabForm}
                openConditionalDialog={openConditionalDialog}
                setOpenConditionalDialog={setOpenConditionalDialog}
              />
            </FormValidationProvider>
          </WorkflowBuilderProvider>
        </NodeSettingsProvider>
      </ReactFlowProvider>
    </FormBuilderProvider>
  )
}
