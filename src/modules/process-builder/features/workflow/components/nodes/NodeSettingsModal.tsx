import { FC, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Node } from 'reactflow'
import { Button } from '@/components/ui/button'
import { ActivitySettings, CronTriggerSettings } from './settings'
import { ManualTriggerSettings } from './settings'
import { DecisionSettings } from './settings/DecisionSettings'

interface NodeSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  node: Node | null
}

export const NodeSettingsModal: FC<NodeSettingsModalProps> = ({ isOpen, onClose, node }) => {
  const [isValid, setIsValid] = useState(true)

  if (!node) return null

  const handleSave = () => {
    if (!isValid) return
    onClose()
  }

  const handleClose = () => {
    if (!isValid) return
    onClose()
  }

  const renderNodeSpecificSettings = () => {
    switch (node.type) {
      case 'manualTriggerNode':
        return <ManualTriggerSettings nodeId={node.id} onValidationChange={setIsValid} />
      case 'cronTriggerNode':
        return <CronTriggerSettings nodeId={node.id} onValidationChange={setIsValid} />
      case 'workflowTriggerNode':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do Workflow</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ex: workflow-123"
                defaultValue={node.data.workflowId}
              />
              <p className="mt-1 text-sm text-gray-500">ID do workflow que irá disparar este nó</p>
            </div>
          </div>
        )
      case 'activityNode':
        return <ActivitySettings nodeId={node.id} onValidationChange={setIsValid} />
      case 'decisionNode':
        return <DecisionSettings nodeId={node.id} onValidationChange={setIsValid} />
      default:
        return (
          <div className="text-gray-500">Este tipo de nó não possui configurações específicas.</div>
        )
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Configurações do Nó</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex-1">{renderNodeSpecificSettings()}</div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-sm">
            Fechar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-sm"
            disabled={!isValid}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
