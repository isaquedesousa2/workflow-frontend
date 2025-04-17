import { WorkflowBuilderModule } from '@/modules/workflow-builder/WorkflowBuilderModule'
import { ReactFlowProvider } from '@xyflow/react'
export default function WorkflowBuilderPage() {
  return (
    <ReactFlowProvider>
      <div className="h-screen">
        <WorkflowBuilderModule />
      </div>
    </ReactFlowProvider>
  )
}
