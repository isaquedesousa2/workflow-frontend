'use client';

import { FC, useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext';
import { Node } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const NodeDrawer: FC = () => {
    const { selectedNode, setSelectedNode, nodes, setNodes } = useWorkflowBuilder();
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setDescription(selectedNode.data.description || '');
        }
    }, [selectedNode]);

    const handleClose = () => {
        setSelectedNode(null);
    };

    const handleSave = () => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            description,
                        },
                    };
                }
                return node;
            })
        );
    };

    if (!selectedNode) return null;

    return (
        <Drawer open={!!selectedNode} onOpenChange={handleClose} direction="right">
            <DrawerContent className="h-full max-h-[100vh]">
                <DrawerHeader>
                    <DrawerTitle>Configurações do Nó</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                            <p className="text-lg font-semibold">{selectedNode.data.type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Rótulo</h3>
                            <p className="text-lg font-semibold">{selectedNode.data.label}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Adicione uma descrição para o nó..."
                                className="resize-none"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} variant="default">
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
