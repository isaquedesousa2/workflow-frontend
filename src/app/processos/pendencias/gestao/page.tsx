'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Clock, AlertCircle, CheckCircle2, Monitor, Search, Users2 } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TeamTask {
  id: string
  title: string
  process: string
  status: 'pending' | 'late' | 'completed' | 'expired'
  dueDate: string
  currentPhase: string
  assignedTo: string
  team: string
  priority: 'high' | 'medium' | 'low'
}

const teamTasks: TeamTask[] = [
  {
    id: '1',
    title: 'Análise de Perfil',
    process: '[RH] Recrutamento',
    status: 'pending',
    dueDate: '25/04/2024',
    currentPhase: 'Entrevista',
    assignedTo: 'Carlos Silva',
    team: 'Recrutamento',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Avaliação Técnica',
    process: '[RH] Recrutamento',
    status: 'late',
    dueDate: '20/04/2024',
    currentPhase: 'Teste Técnico',
    assignedTo: 'Ana Santos',
    team: 'Recrutamento',
    priority: 'medium',
  },
]

type TabType = 'all' | 'pending' | 'expired' | 'late' | 'completed'

interface TabConfig {
  label: string
  count: number
  filter: (task: TeamTask) => boolean
}

export default function GestaoPendenciasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')

  const tabsConfig: Record<TabType, TabConfig> = {
    all: {
      label: 'Todos os cards',
      count: teamTasks.length,
      filter: () => true,
    },
    pending: {
      label: 'Cards prestes a vencer',
      count: teamTasks.filter((t) => t.status === 'pending').length,
      filter: (task) => task.status === 'pending',
    },
    expired: {
      label: 'Vencidos',
      count: teamTasks.filter((t) => t.status === 'expired').length,
      filter: (task) => task.status === 'expired',
    },
    late: {
      label: 'Atrasados',
      count: teamTasks.filter((t) => t.status === 'late').length,
      filter: (task) => task.status === 'late',
    },
    completed: {
      label: 'Concluídos',
      count: teamTasks.filter((t) => t.status === 'completed').length,
      filter: (task) => task.status === 'completed',
    },
  }

  const filteredTasks = teamTasks
    .filter(tabsConfig[activeTab].filter)
    .filter((task) => selectedTeam === 'all' || task.team === selectedTeam)

  return (
    <ContainerMain header={<Header title="Gestão de Pendências" />}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Título e descrição */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users2 className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Gestão de Pendências</h1>
            <p className="text-sm text-gray-500">
              Gerencie e acompanhe as pendências da sua equipe
            </p>
          </div>
        </div>

        {/* Área de busca e filtros */}
        <div className="my-20 px-6 max-w-7xl mx-auto rounded-lg p-10 bg-[#F7F8FA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg">✨</div>
              <span className="text-2xl font-bold">Busque por um processo</span>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Selecione a equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as equipes</SelectItem>
                <SelectItem value="Recrutamento">Recrutamento</SelectItem>
                <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
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
                  <th className="text-left py-4 font-medium text-gray-500">Responsável</th>
                  <th className="text-left py-4 font-medium text-gray-500">Equipe</th>
                  <th className="text-left py-4 font-medium text-gray-500">Prioridade</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-4">{task.title}</td>
                    <td className="py-4 text-gray-500">{task.dueDate}</td>
                    <td className="py-4 text-blue-600">{task.process}</td>
                    <td className="py-4">{task.currentPhase}</td>
                    <td className="py-4 text-gray-500">{task.assignedTo}</td>
                    <td className="py-4 text-gray-500">{task.team}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {task.priority === 'high'
                          ? 'Alta'
                          : task.priority === 'medium'
                          ? 'Média'
                          : 'Baixa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm text-gray-500 mt-4">{filteredTasks.length} resultado(s)</div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <p className="text-gray-600 mb-2">
              Nenhuma pendência encontrada para os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </ContainerMain>
  )
}
