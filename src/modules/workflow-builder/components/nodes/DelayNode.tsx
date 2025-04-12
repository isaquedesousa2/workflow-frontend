import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface DelayNodeData {
    label: string;
    duration: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

export const nodeConfig = {
    type: 'Delay',
    label: 'Atraso',
    icon: '⏰',
    description: 'Adiciona um atraso no fluxo',
    defaultData: {
        label: 'Novo Atraso',
        duration: 1,
        unit: 'minutes',
    },
};

export const DelayNode: FC<NodeProps<DelayNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-purple-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{nodeConfig.icon}</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <Input id="duration" type="number" value={data.duration} min={1} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Select value={data.unit}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="seconds">Segundos</SelectItem>
                            <SelectItem value="minutes">Minutos</SelectItem>
                            <SelectItem value="hours">Horas</SelectItem>
                            <SelectItem value="days">Dias</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
        </Card>
    );
};

export default memo(DelayNode);
