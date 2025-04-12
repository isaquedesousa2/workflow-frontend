import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ActivityNodeData {
    label: string;
    description: string;
    assignee?: string;
    dueDate?: string;
    priority?: 'Baixa' | 'Média' | 'Alta';
}

const ActivityNode: FC<NodeProps<ActivityNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-purple-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={data.description} placeholder="Descreva a atividade..." className="resize-none" rows={3} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignee">Responsável</Label>
                    <Input id="assignee" value={data.assignee} placeholder="Nome do responsável" />
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
        </Card>
    );
};

export default memo(ActivityNode);
