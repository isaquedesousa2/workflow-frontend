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
import {
  NodeSettingsProvider,
  useNodeConfig,
} from '../features/workflow/contexts/NodeConfigContext'
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
import { criarProcessoAction } from '@/app/processos/criacao/actions'

type ActiveTab = 'flow' | 'form' | 'rules'

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
  const { settings } = useNodeConfig()
  const { rows, formName } = useFormBuilder()
  const { state: validationState } = useFormValidation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const getConnections = (nodeId: string, type: 'source' | 'target') =>
      edges
        .filter((edge) => (type === 'source' ? edge.source === nodeId : edge.target === nodeId))
        .map((edge) => (type === 'source' ? edge.target : edge.source))

    const payload = {
      name: processName,
      description: '',
      flow: {
        name: processName,
        description: '',
        nodes: nodes.map((node) => ({
          name: node.data?.label || '',
          description: node.data?.description || '',
          positionX: node.position.x,
          positionY: node.position.y,
          type: node.type,
          settings: settings[node.id].settings,
          connectionSource:
            getConnections(node.id, 'source').length > 0
              ? getConnections(node.id, 'source')[0]
              : null,
          connectionTarget:
            getConnections(node.id, 'target').length > 0
              ? getConnections(node.id, 'target')[0]
              : null,
        })),
      },
      form: {
        name: formName || 'TESTE',
        metadata: {},
      },
      rules: validationState.validations.flatMap((v) =>
        v.rules.map((rule) => ({
          action: rule.action,
          metadata: {},
        })),
      ),
    }

    console.log(payload)
    // try {
    //   const result = await criarProcessoAction(payload)

    //   console.log(result)
    //   if (result.success) {
    //     setSuccess(true)
    //     alert('Processo criado com sucesso!')
    //   } else {
    //     setError(result.error || 'Erro desconhecido')
    //     alert('Erro ao criar processo: ' + (result.error || 'Erro desconhecido'))
    //   }
    // } catch (err: any) {
    //   setError(err.message || 'Erro desconhecido')
    //   alert('Erro ao criar processo: ' + (err.message || 'Erro desconhecido'))
    // } finally {
    //   setLoading(false)
    // }
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
      {activeTab === 'rules' && (
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
