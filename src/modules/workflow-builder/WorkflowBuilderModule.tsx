import { FC } from 'react';
import { Node, Edge } from 'reactflow';
import { WorkflowBuilderProvider } from './contexts/WorkflowBuilderContext';
import { WorkflowCanvas } from './components/WorkflowCanvas';

interface WorkflowData {
    nodes: Node[];
    edges: Edge[];
}

interface WorkflowBuilderModuleProps {
    onSave?: (workflow: WorkflowData) => void;
}

export const WorkflowBuilderModule: FC<WorkflowBuilderModuleProps> = ({ onSave }) => {
    return (
        <WorkflowBuilderProvider>
            <div className="bg-[#253342] w-full h-[60px]" />
            <div className="w-full h-[calc(100vh-60px)] bg-[#EAF0F6]">
                <WorkflowCanvas onSave={onSave} />
            </div>
        </WorkflowBuilderProvider>
    );
};
