import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TextField } from '../../types'

interface TextInputSettingsProps {
  component: TextField
  onUpdate: (updates: Partial<TextField>) => void
}

export function TextInputSettings({ component, onUpdate }: TextInputSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Configurações Básicas */}
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
          value={component.defaultValue || ''}
          onChange={(e) => onUpdate({ defaultValue: e.target.value })}
          placeholder="Digite o valor padrão"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Campo Obrigatório</Label>
          <Switch
            id="required"
            checked={component.required ?? false}
            onCheckedChange={(checked: boolean) =>
              onUpdate({ required: checked })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minLength">Tamanho Mínimo</Label>
        <Input
          id="minLength"
          type="number"
          value={component.minLength || ''}
          onChange={(e) =>
            onUpdate({
              minLength: parseInt(e.target.value) || 0,
            })
          }
          placeholder="Digite o tamanho mínimo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxLength">Tamanho Máximo</Label>
        <Input
          id="maxLength"
          type="number"
          value={component.maxLength || ''}
          onChange={(e) =>
            onUpdate({
              maxLength: parseInt(e.target.value) || 0,
            })
          }
          placeholder="Digite o tamanho máximo"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="readonly">Somente Leitura</Label>
          <Switch
            id="readonly"
            checked={component.readOnly ?? false}
            onCheckedChange={(checked: boolean) =>
              onUpdate({ readOnly: checked })
            }
          />
        </div>
      </div>
    </div>
  )
}
