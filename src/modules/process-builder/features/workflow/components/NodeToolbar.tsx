'use client'

import { useState, FC } from 'react'
import { Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ActivityNode from './nodes/actions/ActivityNode'
import { WebhookNode } from './nodes/actions/WebhookNode'
import { DecisionNode } from './nodes/DecisionNode'
import { JoinNode } from './nodes/JoinNode'
import { CronTriggerNode } from './nodes/triggers/CronTriggerNode'
import { WorkflowTriggerNode } from './nodes/triggers/WorkflowTriggerNode'
import { ManualTriggerNode } from './nodes/triggers/ManualTriggerNode'

interface NodeOption {
  type: string
  label: string
  icon: string
  description: string
  component: FC<any>
  initialData?: {
    type?: string
    description?: string
    conditions?: {
      id: string
      label: string
      value: string
    }[]
    schedule?: string
    workflowId?: string
  }
}

interface NodeCategory {
  label: string
  icon: string
  nodes: NodeOption[]
}

const nodeCategories: NodeCategory[] = [
  {
    label: 'Triggers',
    icon: '⚡',
    nodes: [
      {
        type: 'manualTriggerNode',
        label: 'Disparo manual',
        icon: '⚡',
        description: 'Inicia o workflow quando um usuário aciona manualmente o processo',
        component: ManualTriggerNode,
      },
      // {
      //   type: 'cronTriggerNode',
      //   label: 'Agendamento',
      //   icon: '⏰',
      //   description: 'Inicia o workflow automaticamente em horários específicos',
      //   component: CronTriggerNode,
      //   initialData: {
      //     schedule: '0 9 * * *', // 9:00 AM todos os dias
      //   },
      // },
      {
        type: 'workflowTriggerNode',
        label: 'Disparo por Workflow',
        icon: '🔄',
        description: 'Inicia o workflow quando outro workflow é finalizado',
        component: WorkflowTriggerNode,
        initialData: {
          type: 'workflowTriggerNode',
          description: 'Inicia o workflow quando outro workflow é finalizado',
        },
      },
    ],
  },
  {
    label: 'Ações',
    icon: '🎯',
    nodes: [
      {
        type: 'activityNode',
        label: 'Atividade',
        icon: '📝',
        description: 'Tarefa ou atividade a ser executada',
        component: ActivityNode,
      },
      // {
      //   type: 'webhookNode',
      //   label: 'Disparar Webhook',
      //   icon: '🌐',
      //   description: 'Dispara uma requisição HTTP para um endpoint',
      //   component: WebhookNode,
      // },
    ],
  },
  {
    label: 'Controle de Fluxo',
    icon: '🔄',
    nodes: [
      {
        type: 'decisionNode',
        label: 'Decisão',
        icon: '🔍',
        description: 'Decisão entre duas opções',
        component: DecisionNode,
      },
      {
        type: 'joinNode',
        label: 'Junção',
        icon: '🔗',
        description: 'Ponto de junção para sincronizar múltiplos fluxos',
        component: JoinNode,
      },
    ],
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

          <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto bg-white">
            {nodeCategories.map((category) => (
              <div key={category.label} className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="text-lg">{category.icon}</span>
                  <h3>{category.label}</h3>
                </div>
                {category.nodes.map((node, index) => (
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
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
