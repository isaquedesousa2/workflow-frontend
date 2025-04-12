'use client';

import { createContext, useContext, useState, ReactNode, FC, Dispatch, SetStateAction } from 'react';
import { Edge, Node } from 'reactflow';
import { NodeTypes } from '../types';

interface WorkflowBuilderContextData {
    nodes: Node[];
    edges: Edge[];
    setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
    addNodeBetween: (sourceId: string, targetId: string, nodeType: NodeTypes) => void;
    removeEdge: (edgeId: string) => void;
    selectedNode: Node | null;
    setSelectedNode: Dispatch<SetStateAction<Node | null>>;
    processName: string;
    setProcessName: Dispatch<SetStateAction<string>>;
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextData>({} as WorkflowBuilderContextData);

export const useWorkflowBuilder = () => {
    const context = useContext(WorkflowBuilderContext);
    if (!context) {
        throw new Error('useWorkflowBuilder must be used within a WorkflowBuilderProvider');
    }
    return context;
};

interface WorkflowBuilderProviderProps {
    children: ReactNode;
}

export const WorkflowBuilderProvider: FC<WorkflowBuilderProviderProps> = ({ children }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [processName, setProcessName] = useState('Novo Processo');

    const addNodeBetween = (sourceId: string, targetId: string, nodeType: NodeTypes) => {
        const sourceNode = nodes.find((node) => node.id === sourceId);
        const targetNode = nodes.find((node) => node.id === targetId);

        if (!sourceNode || !targetNode) return;

        // Calcula a posição do novo node no meio do caminho
        const x = (sourceNode.position.x + targetNode.position.x) / 2;
        const y = (sourceNode.position.y + targetNode.position.y) / 2;

        const newNodeId = `node-${Date.now()}`;

        // Cria o novo node com os dados do CustomNode
        const newNode: Node = {
            id: newNodeId,
            type: 'customNode',
            position: { x, y },
            data: {
                label: nodeType,
                type: nodeType,
                icon: nodeType === 'Ação' ? '⚡' : nodeType === 'Condição' ? '❓' : '🎯',
                description: `Nó do tipo ${nodeType}`,
                onDelete: (nodeId: string) => {
                    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
                    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
                },
            },
        };

        // Remove a edge antiga e adiciona as novas edges
        const newEdges = edges.filter((edge) => !(edge.source === sourceId && edge.target === targetId));
        newEdges.push(
            { id: `edge-${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId },
            { id: `edge-${newNodeId}-${targetId}`, source: newNodeId, target: targetId }
        );

        setNodes((prev) => [...prev, newNode]);
        setEdges(newEdges);
    };

    const removeEdge = (edgeId: string) => {
        setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
    };

    return (
        <WorkflowBuilderContext.Provider
            value={{
                nodes,
                edges,
                setNodes,
                setEdges,
                addNodeBetween,
                removeEdge,
                selectedNode,
                setSelectedNode,
                processName,
                setProcessName,
            }}
        >
            {children}
        </WorkflowBuilderContext.Provider>
    );
};
