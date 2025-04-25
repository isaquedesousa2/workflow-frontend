'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { forwardRef } from 'react'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" ref={ref} style={{ zIndex: 9999 }}>
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus locale={ptBR} />
        </PopoverContent>
      </Popover>
    )
  },
)
