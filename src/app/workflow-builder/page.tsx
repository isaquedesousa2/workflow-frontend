import { WorkflowBuilderModule } from '@/modules/process-builder/workflow/WorkflowBuilderModule'
import { ReactFlowProvider } from '@xyflow/react'
import { Toaster } from 'sonner'

export default function WorkflowBuilderPage() {
  return (
    <ReactFlowProvider>
      <div className="h-screen">
        <WorkflowBuilderModule />
        <Toaster />
      </div>
    </ReactFlowProvider>
  )
}
