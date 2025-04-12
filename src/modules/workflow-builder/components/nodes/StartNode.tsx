import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface StartNodeData {
    label: string;
    description: string;
}

export const nodeConfig = {
    type: 'Start',
    label: 'Início',
    icon: '🚀',
    description: 'Marca o início do fluxo',
    defaultData: {
        label: 'Início',
        description: 'Início do fluxo de trabalho',
    },
};

export const StartNode: FC<NodeProps<StartNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-emerald-300 ${selected ? 'ring-2 ring-emerald-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{nodeConfig.icon}</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input id="description" value={data.description} placeholder="Descreva o propósito deste fluxo" />
                </div>
            </CardContent>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-emerald-500" />
        </Card>
    );
};

export default memo(StartNode);
