import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormComponent } from '@/modules/form-builder2/types'
import { useState } from 'react'

interface EmailInputSettingsProps {
  component: FormComponent
  onUpdate: (updates: Partial<FormComponent>) => void
  onErrorChange: (hasError: boolean) => void
}

export function EmailInputSettings({
  component,
  onUpdate,
  onErrorChange,
}: EmailInputSettingsProps) {
  const [error, setError] = useState<string>('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value && !validateEmail(value)) {
      setError('Por favor, insira um email válido')
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
        <Input
          id="defaultValue"
          type="email"
          value={component.defaultValue || ''}
          onChange={handleDefaultValueChange}
          placeholder="exemplo@email.com"
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
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
