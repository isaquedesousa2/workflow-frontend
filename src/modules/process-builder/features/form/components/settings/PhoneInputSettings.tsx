import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/process-builder/features/form/types'
import { useState } from 'react'
import { PatternFormat } from 'react-number-format'

interface PhoneInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function PhoneInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: PhoneInputSettingsProps) {
  const [error, setError] = useState<string>('')

  const validatePhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  const handleDefaultValueChange = (values: { value: string }) => {
    const value = values.value
    if (value && !validatePhone(value)) {
      setError('Por favor, insira um telefone válido (10 ou 11 dígitos)')
      onErrorChange(true)
    } else {
      setError('')
      onErrorChange(false)
    }
    onUpdate({ defaultValue: value })
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
        <PatternFormat
          id="defaultValue"
          value={component.defaultValue || ''}
          onValueChange={handleDefaultValueChange}
          format="(##) #####-####"
          mask="_"
          placeholder="(00) 00000-0000"
          customInput={Input}
          className="w-full"
          type="tel"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
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
    </div>
  )
}
