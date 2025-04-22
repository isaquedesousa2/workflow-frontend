import { FC } from 'react'

interface WorkflowTriggerSettingsProps {
  workflowId: string
  onWorkflowIdChange: (workflowId: string) => void
}

export const WorkflowTriggerSettings: FC<WorkflowTriggerSettingsProps> = ({
  workflowId,
  onWorkflowIdChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ID do Workflow</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm"
          placeholder="Ex: workflow-123"
          value={workflowId}
          onChange={(e) => onWorkflowIdChange(e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">ID do workflow que irá disparar este nó</p>
      </div>
    </div>
  )
}
