import { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface WebhookNodeData {
    label: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string;
    timeout?: number;
}

const WebhookNode: FC<NodeProps<WebhookNodeData>> = ({ data, selected }) => {
    return (
        <Card className={`w-[300px] ring-1 ring-purple-300 ${selected ? 'ring-2 ring-purple-500' : ''}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">🌐</span>
                    {data.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="url">URL do Webhook</Label>
                    <Input id="url" value={data.url} placeholder="https://exemplo.com/webhook" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="method">Método HTTP</Label>
                    <Select value={data.method}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="headers">Headers (JSON)</Label>
                    <Textarea
                        id="headers"
                        value={JSON.stringify(data.headers || {}, null, 2)}
                        placeholder='{"Content-Type": "application/json"}'
                        className="resize-none font-mono"
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="body">Corpo da Requisição (JSON)</Label>
                    <Textarea id="body" value={data.body} placeholder='{"key": "value"}' className="resize-none font-mono" rows={3} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input id="timeout" type="number" value={data.timeout} placeholder="5000" />
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
        </Card>
    );
};

export default memo(WebhookNode);
