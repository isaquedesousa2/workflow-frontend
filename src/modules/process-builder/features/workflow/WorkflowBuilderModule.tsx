'use client'

import { FC } from 'react'
import { Node, Edge } from 'reactflow'
import { WorkflowCanvas } from './components/WorkflowCanvas'

interface WorkflowData {
  nodes: Node[]
  edges: Edge[]
}

interface WorkflowBuilderModuleProps {
  onSave?: (workflow: WorkflowData) => void
}


export const WorkflowBuilderModule: FC<WorkflowBuilderModuleProps> = ({ onSave }) => {
  return (
    <div className="w-full h-full bg-[#EAF0F6]">
      <WorkflowCanvas />
    </div>
  )
}
