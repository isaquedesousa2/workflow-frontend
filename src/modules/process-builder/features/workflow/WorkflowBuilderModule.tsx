'use client'

import { FC } from 'react'
import { Node, Edge } from 'reactflow'
import { WorkflowBuilderProvider } from './contexts/WorkflowBuilderContext'
import { WorkflowCanvas } from './components/WorkflowCanvas'
import { useWorkflowBuilder } from './contexts/WorkflowBuilderContext'
import { EditableText } from './components/EditableText'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useWorkflowValidation } from './hooks/useWorkflowValidation'
import { toast } from 'sonner'
import { NodeSettingsProvider } from './contexts/NodeSettingsContext'

interface WorkflowData {
  nodes: Node[]
  edges: Edge[]
}

interface WorkflowBuilderModuleProps {
  onSave?: (workflow: WorkflowData) => void
}

const WorkflowHeader: FC<{ onSave?: (workflow: WorkflowData) => void }> = ({ onSave }) => {
  const { processName, setProcessName, nodes, edges } = useWorkflowBuilder()
  const { validateWorkflow } = useWorkflowValidation()

  const handleSave = () => {
    const { isValid, errors } = validateWorkflow()

    if (!isValid) {
      errors.forEach((error) => {
        toast.error(error)
      })
      return
    }

    if (onSave) {
      onSave({ nodes, edges })
      toast.success('Workflow salvo com sucesso!')
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
          <EditableText
            value={processName}
            onChange={setProcessName}
            className="text-white text-xl font-semibold text-center"
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

export const WorkflowBuilderModule: FC<WorkflowBuilderModuleProps> = ({ onSave }) => {
  return (
    <NodeSettingsProvider>
      <WorkflowBuilderProvider>
        <WorkflowHeader onSave={onSave} />
        <div className="w-full h-[calc(100vh-60px)] bg-[#EAF0F6]">
          <WorkflowCanvas />
        </div>
      </WorkflowBuilderProvider>
    </NodeSettingsProvider>
  )
}
