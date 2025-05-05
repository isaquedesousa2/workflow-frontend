import { ProcessBuilderPage } from '@/modules/process-builder/page/ProcessBuilderPage'
import { ProcessBuilderProvider } from '@/modules/process-builder/contexts/ProcessBuilderContext'
import { processBuilderService } from '@/services/process-builder/process-builder.service'

const getNodesTypes = async () => {
  'use server'
  const nodesTypes = await processBuilderService.getNodesTypes()
  return nodesTypes
}

export default async function CriacaoProcessoPage() {
  const nodesTypes = await getNodesTypes()

  return (
    <ProcessBuilderProvider nodesTypes={nodesTypes}>
      <ProcessBuilderPage />
    </ProcessBuilderProvider>
  )
}
