import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormComponent } from '@/modules/form-builder2/types'
import { useState } from 'react'

interface NumberInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function NumberInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: NumberInputSettingsProps) {
  const [error, setError] = useState<string>('')

  const validateNumber = (value: string, min?: number, max?: number) => {
    const num = Number(value)
    if (isNaN(num)) {
      return false
    }
    if (min !== undefined && num < min) {
      return false
    }
    if (max !== undefined && num > max) {
      return false
    }
    return true
  }

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const min = component.validation?.min
    const max = component.validation?.max

    if (value && !validateNumber(value, min, max)) {
      setError('Por favor, insira um número válido')
      onErrorChange(true)
    } else {
      setError('')
      onErrorChange(false)
    }
    onUpdate({ defaultValue: value })
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number(e.target.value)
    const max = component.validation?.max
    const defaultValue = component.defaultValue

    if (max !== undefined && min > max) {
      setError('O valor mínimo não pode ser maior que o valor máximo')
      onErrorChange(true)
    } else if (defaultValue && !validateNumber(defaultValue, min, max)) {
      setError('O valor padrão está fora do intervalo permitido')
      onErrorChange(true)
    } else {
      setError('')
      onErrorChange(false)
    }
    onUpdate({ validation: { ...component.validation, min } })
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value)
    const min = component.validation?.min
    const defaultValue = component.defaultValue

    if (min !== undefined && max < min) {
      setError('O valor máximo não pode ser menor que o valor mínimo')
      onErrorChange(true)
    } else if (defaultValue && !validateNumber(defaultValue, min, max)) {
      setError('O valor padrão está fora do intervalo permitido')
      onErrorChange(true)
    } else {
      setError('')
      onErrorChange(false)
    }
    onUpdate({ validation: { ...component.validation, max } })
  }

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = Number(e.target.value)
    onUpdate({ validation: { ...component.validation, step } })
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
        <Label htmlFor="defaultValue">Valor Padrão</Label>
        <Input
          id="defaultValue"
          type="number"
          value={component.defaultValue || ''}
          onChange={handleDefaultValueChange}
          placeholder="Digite o valor padrão"
          min={component.validation?.min}
          max={component.validation?.max}
          step={component.validation?.step || 1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min">Valor Mínimo</Label>
        <Input
          id="min"
          type="number"
          value={component.validation?.min || ''}
          onChange={handleMinChange}
          placeholder="Digite o valor mínimo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max">Valor Máximo</Label>
        <Input
          id="max"
          type="number"
          value={component.validation?.max || ''}
          onChange={handleMaxChange}
          placeholder="Digite o valor máximo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="step">Incremento</Label>
        <Input
          id="step"
          type="number"
          value={component.validation?.step || 1}
          onChange={handleStepChange}
          placeholder="Digite o incremento"
          min={0.1}
        />
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
