import { Node, Edge } from 'reactflow';

export interface WorkflowData {
    nodes: Node[];
    edges: Edge[];
}

export interface NodeData {
    label: string;
    type: string;
    icon?: string;
    properties?: Record<string, any>;
}

export type NodeType = 'Início' | 'Condição' | 'Ação' | 'Fim';

export interface WorkflowMetadata {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    version: string;
}

export interface WorkflowExport extends WorkflowData {
    metadata: WorkflowMetadata;
}
