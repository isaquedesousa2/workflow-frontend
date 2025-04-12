import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DecisionNodeData {
    label: string;
    condition: string;
    trueLabel: string;
    falseLabel: string;
}

export const nodeConfig = {
    type: 'Decision',
    label: 'Decisão',
    icon: '🔄',
    description: 'Cria uma bifurcação condicional no fluxo',
    defaultData: {
        label: 'Nova Decisão',
        condition: '',
        trueLabel: 'Sim',
        falseLabel: 'Não',
    },
};

export const DecisionNode: FC<NodeProps<DecisionNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-yellow-300 ${selected ? 'ring-2 ring-yellow-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{nodeConfig.icon}</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="condition">Condição</Label>
                    <Input id="condition" value={data.condition} placeholder="Digite a condição para a decisão" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="trueLabel">Rótulo para Verdadeiro</Label>
                    <Input id="trueLabel" value={data.trueLabel} placeholder="Ex: Sim, Aprovado, etc" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="falseLabel">Rótulo para Falso</Label>
                    <Input id="falseLabel" value={data.falseLabel} placeholder="Ex: Não, Reprovado, etc" />
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-500" />
            <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 !bg-green-500" />
            <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3 !bg-red-500" />
        </Card>
    );
};

export default memo(DecisionNode);
