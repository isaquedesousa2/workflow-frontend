import { ContainerMain } from '@/components/ContainerMain'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const ProcessBuilderPage = () => {
  return (
    <ContainerMain header="Criar Processo">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nome do Processo</Label>
          <Input />
        </div>
      </div>
    </ContainerMain>
  )
}
