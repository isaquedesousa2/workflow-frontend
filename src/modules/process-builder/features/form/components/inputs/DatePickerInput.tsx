import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { IDatePickerField } from '@/modules/process-builder/features/form/types'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface BaseInputProps {
  field: IDatePickerField
}

export function DatePickerInput({ field }: BaseInputProps) {
  const [date, setDate] = useState<Date>()

  const minDate = field.minDate ? new Date(field.minDate) : undefined
  const maxDate = field.maxDate ? new Date(field.maxDate) : undefined

  return (
    <BaseInput component={field} className="space-y-2">
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
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            locale={ptBR}
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </BaseInput>
  )
}
