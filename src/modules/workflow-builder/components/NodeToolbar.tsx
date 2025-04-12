'use client';

import { useState } from 'react';
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext';
import { Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NodeOption {
    type: string;
    label: string;
    icon: string;
    description: string;
    initialData?: {
        conditions?: {
            id: string;
            label: string;
            value: string;
        }[];
    };
}

const nodeOptions: NodeOption[] = [
    {
        type: 'Início',
        label: 'Início do Fluxo',
        icon: '🎯',
        description: 'Ponto inicial do fluxo de trabalho',
    },
    {
        type: 'Fim',
        label: 'Finalizar Fluxo',
        icon: '🔚',
        description: 'Ponto final do fluxo de trabalho',
    },
    {
        type: 'Atividade',
        label: 'Atividade',
        icon: '📝',
        description: 'Tarefa ou atividade a ser executada',
    },
    {
        type: 'Webhook',
        label: 'Disparar Webhook',
        icon: '🌐',
        description: 'Dispara uma requisição HTTP para um endpoint',
    },
    {
        type: 'Condição',
        label: 'Condição',
        icon: '❓',
        description: 'Bifurcação condicional do fluxo',
        initialData: {
            conditions: [
                { id: 'cond1', label: 'Condição 1', value: 'cond1' },
                { id: 'cond2', label: 'Condição 2', value: 'cond2' },
                { id: 'cond3', label: 'Condição 3', value: 'cond3' },
                { id: 'cond4', label: 'Condição 4', value: 'cond4' },
                { id: 'cond5', label: 'Condição 5', value: 'cond5' },
            ],
        },
    },
    {
        type: 'Atraso',
        label: 'Atraso',
        icon: '⏱️',
        description: 'Adiciona um tempo de espera',
    },
    {
        type: 'Email',
        label: 'Enviar Email',
        icon: '📧',
        description: 'Envia uma mensagem por email',
    },
];

export const NodeToolbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const onDragStart = (event: React.DragEvent, nodeData: NodeOption) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Plus size={24} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="end" side="top" sideOffset={20}>
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Escolha uma ação</h2>
                            <button className="text-blue-600 hover:text-blue-700" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                        {nodeOptions.map((node, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => onDragStart(e, node)}
                                className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors text-left w-full cursor-move"
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center ${
                                        node.type === 'Início'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : node.type === 'Fim'
                                            ? 'bg-red-100 text-red-600'
                                            : node.type === 'Condição'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-orange-100 text-orange-600'
                                    } rounded`}
                                >
                                    <span className="text-lg">{node.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{node.label}</h3>
                                    <p className="text-sm text-gray-500">{node.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
