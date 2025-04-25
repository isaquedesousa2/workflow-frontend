import Link from 'next/link'
import { WorkflowBuilderModule } from '@/modules/process-builder/workflow/WorkflowBuilderModule'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Módulos Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/workflow-builder" className="p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Workflow Builder</h2>
          <p className="text-gray-600">Crie e gerencie fluxos de trabalho</p>
        </Link>
        <Link href="/form-builder" className="p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Form Builder</h2>
          <p className="text-gray-600">Crie e personalize formulários</p>
        </Link>
      </div>
    </div>
  )
}
