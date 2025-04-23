'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Clock, AlertCircle, CheckCircle2, Monitor, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  process: string
  status: 'pending' | 'late' | 'completed' | 'expired'
  dueDate: string
  currentPhase: string
  createdAt: string
  assignedAt: string
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Melanie Davis',
    process: '[RH] Recrutamento',
    status: 'pending',
    dueDate: 'Desconhecido',
    currentPhase: 'Proposta',
    createdAt: 'domingo, 20 de abril de 2024',
    assignedAt: 'terça-feira, 22 de abril de 2024',
  },
  {
    id: '2',
    title: 'Melanie Davis',
    process: '[RH] Recrutamento',
    status: 'pending',
    dueDate: 'Desconhecido',
    currentPhase: 'Proposta',
    createdAt: 'domingo, 20 de abril de 2024',
    assignedAt: 'terça-feira, 22 de abril de 2024',
  },
]

type TabType = 'all' | 'pending' | 'expired' | 'late' | 'completed'

interface TabConfig {
  label: string
  count: number
  filter: (task: Task) => boolean
}

export default function PendenciasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const tabsConfig: Record<TabType, TabConfig> = {
    all: {
      label: 'Todos os cards',
      count: tasks.length,
      filter: () => true,
    },
    pending: {
      label: 'Cards prestes a vencer',
      count: tasks.filter((t) => t.status === 'pending').length,
      filter: (task) => task.status === 'pending',
    },
    expired: {
      label: 'Vencidos',
      count: tasks.filter((t) => t.status === 'expired').length,
      filter: (task) => task.status === 'expired',
    },
    late: {
      label: 'Atrasados',
      count: tasks.filter((t) => t.status === 'late').length,
      filter: (task) => task.status === 'late',
    },
    completed: {
      label: 'Concluídos',
      count: tasks.filter((t) => t.status === 'completed').length,
      filter: (task) => task.status === 'completed',
    },
  }

  const filteredTasks = tasks.filter(tabsConfig[activeTab].filter)

  return (
    <ContainerMain header={<Header title="Meu trabalho" />}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Título e descrição */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Monitor className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Minhas pendências</h1>
            <p className="text-sm text-gray-500">
              Aqui você pode visualizar e gerenciar as tarefas atribuídas a você.
            </p>
          </div>
        </div>

        <div className="my-20 px-6 max-w-7xl mx-auto rounded-lg p-10 bg-[#F7F8FA]">
          <div className="flex items-center gap-2">
            <div className="text-lg">✨</div>
            <span className="text-2xl font-bold">Busque por um processo</span>
          </div>
          <div className="mt-4 relative">
            <Input
              type="text"
              placeholder="Digite o que você está procurando..."
              className="bg-white"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-8">
          {(Object.entries(tabsConfig) as [TabType, TabConfig][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.label} ({config.count})
            </button>
          ))}
        </div>

        {/* Lista de tarefas ou mensagem de estado vazio */}
        {filteredTasks.length > 0 ? (
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left py-4 font-medium text-gray-500">Solicitação</th>
                  <th className="text-left py-4 font-medium text-gray-500">Data de vencimento</th>
                  <th className="text-left py-4 font-medium text-gray-500">Processo</th>
                  <th className="text-left py-4 font-medium text-gray-500">Fase atual</th>
                  <th className="text-left py-4 font-medium text-gray-500">Solicitante</th>
                  <th className="text-left py-4 font-medium text-gray-500">Responsável</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-4">{task.title}</td>
                    <td className="py-4 text-gray-500">{task.dueDate}</td>
                    <td className="py-4 text-blue-600">{task.process}</td>
                    <td className="py-4">{task.currentPhase}</td>
                    <td className="py-4 text-gray-500">{task.createdAt}</td>
                    <td className="py-4 text-gray-500">{task.assignedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm text-gray-500 mt-4">1 - 1 de 1 resultados</div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <p className="text-gray-600 mb-2">Parece que ainda não há tarefas atribuídas a você.</p>
          </div>
        )}
      </div>
    </ContainerMain>
  )
}
