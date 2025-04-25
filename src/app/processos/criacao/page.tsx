import { ProcessBuilderPage } from '@/modules/process-builder/page/ProcessBuilderPage'
import { ProcessBuilderProvider } from '@/modules/process-builder/contexts/ProcessBuilderContext'
export default function CriacaoProcessoPage() {
  return (
    <ProcessBuilderProvider>
      <ProcessBuilderPage />
    </ProcessBuilderProvider>
  )
}
