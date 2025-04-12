import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface EndNodeData {
    label: string;
    description: string;
}

export const nodeConfig = {
    type: 'End',
    label: 'Fim',
    icon: '🏁',
    description: 'Marca o fim do fluxo',
    defaultData: {
        label: 'Fim',
        description: 'Fim do fluxo de trabalho',
    },
};

export const EndNode: FC<NodeProps<EndNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-red-300 ${selected ? 'ring-2 ring-red-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{nodeConfig.icon}</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input id="description" value={data.description} placeholder="Descreva o resultado final deste fluxo" />
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-red-500" />
        </Card>
    );
};

export default memo(EndNode);
