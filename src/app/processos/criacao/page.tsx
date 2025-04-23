'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Grid, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export default function FormularioPage() {
  return (
    <ContainerMain
      className="p-0"
      header={<Header title="Criação de processo" />}
      subHeader={
        <div className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">Formulário</h1>
            <div className="h-4 w-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="flex min-w-32 items-center gap-2 rounded-sm px-2 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Grid className="h-5 w-5" />
                Fluxo
              </Link>
              <Link
                href="#"
                className="flex min-w-32 items-center gap-2 rounded-sm px-2 py-2 text-gray-600 hover:bg-gray-100"
              >
                <LayoutGrid className="h-5 w-5" />
                Formulário
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Ver no pipe</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Editar pipe</Button>
          </div>
        </div>
      }
    >
      <main className="flex-1 bg-gray-100">
        <div className="">
          {/* <div className="mb-8">
            <h2 className="text-2xl font-bold">Vamos começar adicionando alguns campos</h2>
            <p className="mt-2 text-gray-600">
              Crie seu formulário arrastando os campos desejados para a área abaixo
            </p>
          </div> */}

          <div className="col-span-3 z-0 space-y-4 overflow-y-scroll max-h-[calc(100vh-18vh)] bg-white py-4 px-4 fixed top-[calc(18.5vh)] left-0 bottom-0 h-full">
            <div className="bg-white p-4">
              <h3 className="mb-4 font-medium">Campos básicos</h3>
              <div className="space-y-2">
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Texto curto</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Texto longo</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Número</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 bg-purple-50 hover:bg-purple-100 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                  <span className="text-sm">Data</span>
                </div>
              </div>
            </div>

            <div className=" bg-white p-4">
              <h3 className="mb-4 font-medium">Campos avançados</h3>
              <div className="space-y-2">
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Seleção única</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Múltipla escolha</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Upload de arquivo</span>
                </div>
                <div className="cursor-pointer rounded border border-dashed p-3 hover:border-purple-500 hover:bg-purple-50">
                  <span className="text-sm">Assinatura</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 p-16">
            {/* Área de campos disponíveis */}
            <div className="col-span-3"></div>

            {/* Área de construção do formulário */}
            <div className="col-span-6">
              <div className="min-h-[600px] rounded-lg border bg-white p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">
                      Arraste os campos desejados para começar a construir seu formulário
                    </p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Adicionar campo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Área de propriedades */}
            <div className="col-span-3">
              <div className="rounded-lg border bg-white p-4">
                <h3 className="mb-4 font-medium">Propriedades do formulário</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nome do formulário</label>
                    <Input placeholder="Digite o nome do formulário" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Descrição</label>
                    <Input placeholder="Digite uma descrição" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Processo</label>
                    <Input placeholder="Selecione o processo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ContainerMain>
  )
}
