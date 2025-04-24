import { ContainerMain } from '@/components/ContainerMain'
import { Header } from '@/components/Header'
import { Clock } from 'lucide-react'

export default function Page() {
  return (
    <ContainerMain header={<Header title="Processos" />}>
      <div className="flex gap-4 m-auto max-w-3xl h-[calc(100vh-150px)]">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
          <div className="bg-purple-500/20 h-9 w-9 rounded-full flex items-center justify-center">
            IS
          </div>
          <span>
            <b>Isaque de Sousa</b>, que bom que você está aqui!
          </span>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
              <Clock className="w-5 h-5 text-gray-600" />
            Minhas pendências
            </div>
          </div>
        </div>
      </div>
    </ContainerMain>
  )
}
