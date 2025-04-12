'use client'

import { useState, FC } from 'react'
import { Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ActivityNode from './nodes/ActivityNode'
import { WebhookNode } from './nodes/WebhookNode'
import { ConditionNode } from './nodes/ConditionNode'
import DecisionNode from '@/modules/workflow-builder/components/nodes/DecisionNode'

interface NodeOption {
  type: string
  label: string
  icon: string
  description: string
  component: FC<any>
  initialData?: {
    conditions?: {
      id: string
      label: string
      value: string
    }[]
  }
}

const nodeOptions: NodeOption[] = [
  {
    type: 'Atividade',
    label: 'Atividade',
    icon: '📝',
    description: 'Tarefa ou atividade a ser executada',
    component: ActivityNode,
  },
  {
    type: 'Decisão',
    label: 'Decisão',
    icon: '🔍',
    description: 'Decisão entre duas opções',
    component: DecisionNode,
  },
  {
    type: 'Webhook',
    label: 'Disparar Webhook',
    icon: '🌐',
    description: 'Dispara uma requisição HTTP para um endpoint',
    component: WebhookNode,
  },
  {
    type: 'Condição',
    label: 'Condição',
    icon: '❓',
    description: 'Bifurcação condicional do fluxo',
    component: ConditionNode,
    initialData: {
      conditions: [
        { id: 'cond1', label: 'Condição 1', value: 'cond1' },
        { id: 'cond2', label: 'Condição 2', value: 'cond2' },
        { id: 'cond2', label: 'Condição 2', value: 'cond2' },
      ],
    },
  },
]

export const NodeToolbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const onDragStart = (event: React.DragEvent, nodeData: NodeOption) => {
    const { type, label, icon, description, initialData } = nodeData
    const serializedData = { type, label, icon, description, initialData }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(serializedData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus
              size={28}
              className="transform transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[420px] p-0 border-none shadow-xl rounded-xl overflow-hidden"
          align="end"
          side="top"
          sideOffset={20}
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Adicionar Nó</h2>
              <button
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Plus className="rotate-45" size={20} />
              </button>
            </div>
            <p className="text-white/80 text-sm mt-1">Arraste um nó para o canvas</p>
          </div>

          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto bg-white">
            {nodeOptions.map((node, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, node)}
                className="flex items-center gap-4 p-4 border rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 text-left w-full cursor-move group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 group-hover:text-purple-700 transition-colors">
                  <span className="text-xl">{node.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {node.label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                    {node.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
