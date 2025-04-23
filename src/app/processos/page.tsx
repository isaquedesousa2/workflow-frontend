'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import {
  Clock,
  Plus,
  Users,
  FileText,
  UserCheck,
  UserMinus,
  Search,
  ChevronDown,
  Building,
  Briefcase,
  GraduationCap,
  HeartPulse,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProcessCategory } from '@/components/ProcessCategory'
import { ProcessCard } from '@/components/ProcessCard'
import Link from 'next/link'

export default function Page() {
  return (
    <ContainerMain header={<Header title="Processos" />}>
      {/* Seção de Boas-vindas */}
      <div className="flex gap-4 m-auto max-w-7xl px-6">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 h-9 w-9 rounded-full flex items-center justify-center">
              IS
            </div>
            <span>
              <b>Isaque de Sousa</b>, vamos fazer algo incrível!
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/processos/pendencias"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <Clock className="w-5 h-5 text-gray-600" />
              Minhas pendências
            </Link>
          </div>
        </div>
      </div>

      {/* Campo de Busca */}
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

      {/* Seção de Processos Recentes */}
      <div className="my-20 max-w-7xl flex flex-col gap-4 mx-auto">
        <span className="font-medium text-lg mb-4">Recentes</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProcessCard
            title="Abertura de Vagas"
            icon={<FileText className="w-5 h-5" />}
            count={4}
            label="requisições"
            bgColor="bg-blue-500/10"
            textColor="text-blue-600"
          />
          <ProcessCard
            title="Recrutamento"
            icon={<Users className="w-5 h-5" />}
            count={5}
            label="candidatos"
            bgColor="bg-emerald-500/10"
            textColor="text-emerald-600"
          />
          <ProcessCard
            title="Onboarding"
            icon={<UserCheck className="w-5 h-5" />}
            count={6}
            label="onboardings"
            bgColor="bg-yellow-500/10"
            textColor="text-yellow-600"
          />
        </div>
      </div>

      {/* Categorias de Processos */}
      <div className="max-w-7xl mx-auto space-y-4">
        <Accordion type="multiple" className="space-y-4">
          <ProcessCategory
            title="Recursos Humanos"
            icon={<Users className="w-5 h-5" />}
            bgColor="bg-blue-500/10"
            textColor="text-blue-600"
            value="rh"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProcessCard
                title="Abertura de Vagas"
                icon={<FileText className="w-5 h-5" />}
                count={4}
                label="requisições"
                bgColor="bg-blue-500/10"
                textColor="text-blue-600"
              />
              <ProcessCard
                title="Recrutamento"
                icon={<Users className="w-5 h-5" />}
                count={5}
                label="candidatos"
                bgColor="bg-emerald-500/10"
                textColor="text-emerald-600"
              />
              <ProcessCard
                title="Onboarding"
                icon={<UserCheck className="w-5 h-5" />}
                count={6}
                label="onboardings"
                bgColor="bg-yellow-500/10"
                textColor="text-yellow-600"
              />
            </div>
          </ProcessCategory>

          {/* Administrativo */}
          <ProcessCategory
            title="Administrativo"
            icon={<Building className="w-5 h-5" />}
            bgColor="bg-purple-500/10"
            textColor="text-purple-600"
            value="adm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProcessCard
                title="Compras"
                icon={<Briefcase className="w-5 h-5" />}
                count={3}
                label="solicitações"
                bgColor="bg-purple-500/10"
                textColor="text-purple-600"
              />
              <ProcessCard
                title="Contratos"
                icon={<FileText className="w-5 h-5" />}
                count={7}
                label="documentos"
                bgColor="bg-purple-500/10"
                textColor="text-purple-600"
              />
            </div>
          </ProcessCategory>

          {/* Comercial */}
          <ProcessCategory
            title="Comercial"
            icon={<Briefcase className="w-5 h-5" />}
            bgColor="bg-green-500/10"
            textColor="text-green-600"
            value="comercial"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProcessCard
                title="Prospecção"
                icon={<Users className="w-5 h-5" />}
                count={12}
                label="leads"
                bgColor="bg-green-500/10"
                textColor="text-green-600"
              />
              <ProcessCard
                title="Vendas"
                icon={<FileText className="w-5 h-5" />}
                count={5}
                label="propostas"
                bgColor="bg-green-500/10"
                textColor="text-green-600"
              />
            </div>
          </ProcessCategory>

          {/* Treinamento */}
          <ProcessCategory
            title="Treinamento"
            icon={<GraduationCap className="w-5 h-5" />}
            bgColor="bg-yellow-500/10"
            textColor="text-yellow-600"
            value="treinamento"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProcessCard
                title="Capacitação"
                icon={<GraduationCap className="w-5 h-5" />}
                count={4}
                label="cursos"
                bgColor="bg-yellow-500/10"
                textColor="text-yellow-600"
              />
              <ProcessCard
                title="Avaliações"
                icon={<FileText className="w-5 h-5" />}
                count={8}
                label="testes"
                bgColor="bg-yellow-500/10"
                textColor="text-yellow-600"
              />
            </div>
          </ProcessCategory>

          {/* Saúde e Segurança */}
          <ProcessCategory
            title="Saúde e Segurança"
            icon={<HeartPulse className="w-5 h-5" />}
            bgColor="bg-red-500/10"
            textColor="text-red-600"
            value="saude"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProcessCard
                title="Exames Médicos"
                icon={<HeartPulse className="w-5 h-5" />}
                count={15}
                label="agendamentos"
                bgColor="bg-red-500/10"
                textColor="text-red-600"
              />
              <ProcessCard
                title="Incidentes"
                icon={<FileText className="w-5 h-5" />}
                count={2}
                label="registros"
                bgColor="bg-red-500/10"
                textColor="text-red-600"
              />
            </div>
          </ProcessCategory>
        </Accordion>
      </div>
    </ContainerMain>
  )
}
