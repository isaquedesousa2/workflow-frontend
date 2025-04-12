import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface NotificationNodeData {
    label: string;
    type: 'email' | 'slack' | 'teams' | 'webhook';
    title: string;
    message: string;
    recipient?: string;
    webhookUrl?: string;
}

export const nodeConfig = {
    type: 'Notification',
    label: 'Notificação',
    icon: '📢',
    description: 'Envia uma notificação',
    defaultData: {
        label: 'Nova Notificação',
        type: 'email',
        title: '',
        message: '',
        recipient: '',
        webhookUrl: '',
    },
};

export const NotificationNode: FC<NodeProps<NotificationNodeData>> = ({ data, selected }) => {
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
                    <Label htmlFor="type">Tipo de Notificação</Label>
                    <Select value={data.type}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="slack">Slack</SelectItem>
                            <SelectItem value="teams">Microsoft Teams</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={data.title} placeholder="Título da notificação" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea id="message" value={data.message} placeholder="Conteúdo da notificação" className="resize-none" rows={3} />
                </div>
                {data.type === 'email' && (
                    <div className="space-y-2">
                        <Label htmlFor="recipient">Destinatário</Label>
                        <Input id="recipient" value={data.recipient} placeholder="email@exemplo.com" />
                    </div>
                )}
                {data.type === 'webhook' && (
                    <div className="space-y-2">
                        <Label htmlFor="webhookUrl">URL do Webhook</Label>
                        <Input id="webhookUrl" value={data.webhookUrl} placeholder="https://exemplo.com/webhook" />
                    </div>
                )}
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
        </Card>
    );
};

export default memo(NotificationNode);
