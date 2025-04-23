'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Settings, Plus, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Process {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'inactive'
  phases: string[]
  createdAt: string
  updatedAt: string
}

const processes: Process[] = [
  {
    id: '1',
    name: '[RH] Recrutamento',
    description: 'Processo de recrutamento e seleção de candidatos',
    category: 'Recursos Humanos',
    status: 'active',
    phases: ['Triagem', 'Entrevista', 'Teste Técnico', 'Proposta', 'Contratação'],
    createdAt: '20/04/2024',
    updatedAt: '22/04/2024',
  },
  {
    id: '2',
    name: '[COM] Vendas',
    description: 'Processo de vendas e negociação',
    category: 'Comercial',
    status: 'active',
    phases: ['Prospecção', 'Apresentação', 'Negociação', 'Fechamento'],
    createdAt: '19/04/2024',
    updatedAt: '21/04/2024',
  },
]

export default function AdminProcessosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)

  const filteredProcesses = processes.filter((process) => {
    const matchesCategory = selectedCategory === 'all' || process.category === selectedCategory
    const matchesSearch =
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <ContainerMain header={<Header title="Administração de Processos" />}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Título e descrição */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Administração de Processos</h1>
            <p className="text-sm text-gray-500">Gerencie os processos do sistema</p>
          </div>
        </div>

        {/* Área de busca e filtros */}
        <div className="my-8 px-6 max-w-7xl mx-auto rounded-lg p-10 bg-[#F7F8FA]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-lg">✨</div>
              <span className="text-2xl font-bold">Busque por um processo</span>
            </div>
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Processo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Processo</DialogTitle>
                  <DialogDescription>Crie um novo processo no sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Nome do Processo</label>
                    <Input id="name" placeholder="Ex: [RH] Recrutamento" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Descrição</label>
                    <Input id="description" placeholder="Descreva o processo" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rh">Recursos Humanos</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">Criar Processo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Digite o que você está procurando..."
                className="bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de processos */}
        {filteredProcesses.length > 0 ? (
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left py-4 font-medium text-gray-500">Nome</th>
                  <th className="text-left py-4 font-medium text-gray-500">Descrição</th>
                  <th className="text-left py-4 font-medium text-gray-500">Categoria</th>
                  <th className="text-left py-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 font-medium text-gray-500">Fases</th>
                  <th className="text-left py-4 font-medium text-gray-500">Última atualização</th>
                  <th className="text-left py-4 font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcesses.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="py-4 font-medium">{process.name}</td>
                    <td className="py-4 text-gray-500">{process.description}</td>
                    <td className="py-4">{process.category}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          process.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {process.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">{process.phases.length} fases</td>
                    <td className="py-4 text-gray-500">{process.updatedAt}</td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProcess(process)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <PencilLine className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm text-gray-500 mt-4">
              {filteredProcesses.length} resultado(s)
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <p className="text-gray-600 mb-2">
              Nenhum processo encontrado para os filtros selecionados.
            </p>
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Processo</DialogTitle>
              <DialogDescription>Faça alterações no processo selecionado</DialogDescription>
            </DialogHeader>
            {selectedProcess && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-name">Nome do Processo</label>
                  <Input id="edit-name" defaultValue={selectedProcess.name} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-description">Descrição</label>
                  <Input id="edit-description" defaultValue={selectedProcess.description} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-category">Categoria</label>
                  <Select defaultValue={selectedProcess.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-status">Status</label>
                  <Select defaultValue={selectedProcess.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContainerMain>
  )
}
