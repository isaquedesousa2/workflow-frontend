import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types/task';

const statusOptions = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'IN_PROGRESS', label: 'Em Andamento' },
    { value: 'COMPLETED', label: 'Concluído' },
    { value: 'CANCELLED', label: 'Cancelado' },
];

interface StatusFilterProps {
    value: TaskStatus[];
    onChange: (value: TaskStatus[]) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (status: TaskStatus) => {
        if (value.includes(status)) {
            onChange(value.filter((s) => s !== status));
        } else {
            onChange([...value, status]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value.length > 0 ? (
                        <div className="flex gap-1">
                            {value.map((status) => (
                                <Badge key={status} variant="secondary">
                                    {statusOptions.find((s) => s.value === status)?.label}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        'Selecione o status'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="max-h-[300px] overflow-y-auto">
                    {statusOptions.map((status) => (
                        <div
                            key={status.value}
                            className={cn(
                                'flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-accent',
                                value.includes(status.value as TaskStatus) && 'bg-accent'
                            )}
                            onClick={() => handleSelect(status.value as TaskStatus)}
                        >
                            <span>{status.label}</span>
                            {value.includes(status.value as TaskStatus) && <Check className="h-4 w-4" />}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
