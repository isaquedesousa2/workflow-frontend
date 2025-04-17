import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

interface BaseInputProps {
  field: FormComponent
}

export function DatePickerInput({ field }: BaseInputProps) {
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-2">
      {field.label && <Label className="text-sm font-medium">{field.label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date
              ? format(date, 'PPP', { locale: ptBR })
              : field.placeholder || 'Selecione uma data'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
        </PopoverContent>
      </Popover>
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
