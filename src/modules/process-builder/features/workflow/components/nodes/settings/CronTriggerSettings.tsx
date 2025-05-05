import { FC, useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useNodeConfig } from '../../../contexts/NodeConfigContext'

interface CronTriggerSettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

const INTERVAL_OPTIONS = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  CUSTOM: 'CUSTOM',
} as const

const WEEKDAYS = [
  { value: '1', label: 'Segunda-feira' },
  { value: '2', label: 'Terça-feira' },
  { value: '3', label: 'Quarta-feira' },
  { value: '4', label: 'Quinta-feira' },
  { value: '5', label: 'Sexta-feira' },
  { value: '6', label: 'Sábado' },
  { value: '0', label: 'Domingo' },
]

const getFormattedSchedule = (
  schedule: string,
  intervalType: string,
  selectedWeekdays: string[],
) => {
  if (intervalType === 'CUSTOM') return schedule

  const [minute, hour] = schedule.split(' ')
  const time = `${hour}:${minute}`

  if (intervalType === 'DAILY') {
    return `Diariamente às ${time}`
  }

  if (intervalType === 'WEEKLY') {
    const days = selectedWeekdays
      .map((day) => WEEKDAYS.find((w) => w.value === day)?.label)
      .filter(Boolean)
      .join(', ')

    return `Toda ${days} às ${time}`
  }

  return schedule
}

export const CronTriggerSettings: FC<CronTriggerSettingsProps> = ({
  nodeId,
  onValidationChange,
}) => {
  const { getNodeConfig, updateNodeConfig } = useNodeConfig()
  const nodeConfig = getNodeConfig(nodeId)
  const schedule = nodeConfig?.data?.schedule || ''

  const [intervalType, setIntervalType] = useState<'DAILY' | 'WEEKLY' | 'CUSTOM'>('DAILY')
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState({ hour: '09', minute: '00' })
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Parse existing schedule if it exists
    if (schedule) {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.split(' ')

      if (dayOfWeek === '*') {
        setIntervalType('DAILY')
      } else if (dayOfWeek !== '*') {
        setIntervalType('WEEKLY')
        setSelectedWeekdays(dayOfWeek.split(','))
      } else {
        setIntervalType('CUSTOM')
      }

      setSelectedTime({ hour, minute })
    }
  }, [schedule])

  useEffect(() => {
    // Validate settings
    const hasValidTime = Boolean(selectedTime.hour && selectedTime.minute)
    const hasValidWeekdays = intervalType !== 'WEEKLY' || selectedWeekdays.length > 0

    const newIsValid = hasValidTime && hasValidWeekdays
    setIsValid(newIsValid)
    onValidationChange?.(newIsValid)
  }, [intervalType, selectedTime, selectedWeekdays, onValidationChange])

  const handleIntervalChange = (type: 'DAILY' | 'WEEKLY' | 'CUSTOM') => {
    setIntervalType(type)
    updateSchedule()
  }

  const handleWeekdayChange = (day: string) => {
    const newWeekdays = selectedWeekdays.includes(day)
      ? selectedWeekdays.filter((d) => d !== day)
      : [...selectedWeekdays, day]
    setSelectedWeekdays(newWeekdays)
    updateSchedule()
  }

  const handleTimeChange = (value: string, type: 'hour' | 'minute') => {
    setSelectedTime((prev) => ({ ...prev, [type]: value }))
    updateSchedule()
  }

  const updateSchedule = (customSchedule?: string) => {
    let newSchedule = customSchedule

    if (!customSchedule) {
      if (intervalType === 'DAILY') {
        newSchedule = `${selectedTime.minute} ${selectedTime.hour} * * *`
      } else if (intervalType === 'WEEKLY') {
        const weekdays = selectedWeekdays.length > 0 ? selectedWeekdays.join(',') : '*'
        newSchedule = `${selectedTime.minute} ${selectedTime.hour} * * ${weekdays}`
      }
    }

    if (newSchedule) {
      updateNodeConfig(nodeId, {
        ...nodeConfig,
        data: {
          ...nodeConfig?.data,
          schedule: newSchedule,
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Intervalo de Execução
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="daily"
              checked={intervalType === 'DAILY'}
              onCheckedChange={() => handleIntervalChange('DAILY')}
            />
            <Label htmlFor="daily">Diariamente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weekly"
              checked={intervalType === 'WEEKLY'}
              onCheckedChange={() => handleIntervalChange('WEEKLY')}
            />
            <Label htmlFor="weekly">Semanalmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="custom"
              checked={intervalType === 'CUSTOM'}
              onCheckedChange={() => handleIntervalChange('CUSTOM')}
            />
            <Label htmlFor="custom">Expressão Cron Personalizada</Label>
          </div>
        </div>
      </div>

      {intervalType === 'WEEKLY' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dias da Semana</label>
          <div className="grid grid-cols-2 gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`weekday-${day.value}`}
                  checked={selectedWeekdays.includes(day.value)}
                  onCheckedChange={() => handleWeekdayChange(day.value)}
                />
                <Label htmlFor={`weekday-${day.value}`}>{day.label}</Label>
              </div>
            ))}
          </div>
          {!selectedWeekdays.length && (
            <p className="text-xs text-red-500">Selecione pelo menos um dia da semana</p>
          )}
        </div>
      )}

      {intervalType !== 'CUSTOM' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hora</label>
              <Select
                value={selectedTime.hour}
                onValueChange={(value) => handleTimeChange(value, 'hour')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a hora" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minutos</label>
              <Select
                value={selectedTime.minute}
                onValueChange={(value) => handleTimeChange(value, 'minute')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione os minutos" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(!selectedTime.hour || !selectedTime.minute) && (
            <p className="text-xs text-red-500">Selecione a hora e os minutos</p>
          )}
        </div>
      )}

      {intervalType === 'CUSTOM' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Expressão Cron</label>
          <Input
            value={schedule}
            onChange={(e) => updateSchedule(e.target.value)}
            placeholder="Ex: 0 9 * * *"
          />
          <p className="text-xs text-gray-500">
            Use a expressão cron para definir quando o workflow será executado
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-sm">
        <p className="text-sm text-gray-600">
          Próxima execução: {getFormattedSchedule(schedule, intervalType, selectedWeekdays)}
        </p>
        {!isValid && (
          <p className="text-xs text-red-500 mt-2">
            Configure todos os campos necessários para salvar as configurações
          </p>
        )}
      </div>
    </div>
  )
}
