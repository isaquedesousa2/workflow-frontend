import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormComponent } from '@/modules/form-builder2/types'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DatePickerInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function DatePickerInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: DatePickerInputSettingsProps) {
  const [error, setError] = useState<string>('')
  const [minDate, setMinDate] = useState<Date | undefined>(
    component.validation?.minDate ? new Date(component.validation.minDate) : undefined,
  )
  const [maxDate, setMaxDate] = useState<Date | undefined>(
    component.validation?.maxDate ? new Date(component.validation.maxDate) : undefined,
  )

  const validateDates = (newMinDate?: Date, newMaxDate?: Date) => {
    if (newMinDate && newMaxDate && newMinDate > newMaxDate) {
      setError('A data mínima não pode ser maior que a data máxima')
      onErrorChange(true)
      return false
    }
    setError('')
    onErrorChange(false)
    return true
  }

  const handleMinDateChange = (date: Date | undefined) => {
    setMinDate(date)
    if (validateDates(date, maxDate)) {
      onUpdate({
        validation: {
          ...component.validation,
          minDate: date?.toISOString(),
        },
      })
    }
  }

  const handleMaxDateChange = (date: Date | undefined) => {
    setMaxDate(date)
    if (validateDates(minDate, date)) {
      onUpdate({
        validation: {
          ...component.validation,
          maxDate: date?.toISOString(),
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome do Campo</Label>
        <Input
          id="label"
          value={component.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Digite o nome do campo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Texto de Ajuda</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Digite o texto de ajuda"
        />
      </div>

      <div className="space-y-2">
        <Label>Data Mínima</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !minDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {minDate ? format(minDate, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={minDate}
              onSelect={handleMinDateChange}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Data Máxima</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !maxDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {maxDate ? format(maxDate, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={maxDate}
              onSelect={handleMaxDateChange}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Campo Obrigatório</Label>
          <Switch
            id="required"
            checked={component.validation?.required ?? false}
            onCheckedChange={(checked: boolean) =>
              onUpdate({ validation: { ...component.validation, required: checked } })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={component.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Digite a descrição do campo"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
