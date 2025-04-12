import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext';

export const useWorkflowOperations = () => {
    const { nodes, edges, setNodes, setEdges } = useWorkflowBuilder();

    const deleteNode = useCallback(
        (nodeId: string) => {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        },
        [setNodes, setEdges]
    );

    const updateNodeData = useCallback(
        (nodeId: string, newData: any) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                ...newData,
                            },
                        };
                    }
                    return node;
                })
            );
        },
        [setNodes]
    );

    const exportWorkflow = useCallback(() => {
        return {
            nodes,
            edges,
        };
    }, [nodes, edges]);

    const importWorkflow = useCallback(
        (workflow: { nodes: Node[]; edges: Edge[] }) => {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
        },
        [setNodes, setEdges]
    );

    const clearWorkflow = useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, [setNodes, setEdges]);

    return {
        deleteNode,
        updateNodeData,
        exportWorkflow,
        importWorkflow,
        clearWorkflow,
    };
};
