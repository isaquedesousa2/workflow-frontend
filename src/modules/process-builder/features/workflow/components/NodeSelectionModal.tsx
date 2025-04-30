'use client'

import { FC } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NodeTypes } from '@/modules/process-builder/features/workflow/types'

interface NodeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (nodeType: NodeTypes) => void
}

const NODE_OPTIONS = [
  { type: NodeTypes.START, label: 'Início' },
  { type: NodeTypes.ACTION, label: 'Ação' },
  { type: NodeTypes.CONDITION, label: 'Condição' },
  { type: NodeTypes.END, label: 'Fim' },
]

export const NodeSelectionModal: FC<NodeSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione o tipo de nó</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {NODE_OPTIONS.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              onClick={() => onSelect(option.type)}
              className="flex flex-col items-center gap-2 p-4"
            >
              <span className="text-lg">{option.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
