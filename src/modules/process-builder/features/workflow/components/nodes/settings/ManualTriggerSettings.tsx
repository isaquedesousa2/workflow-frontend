import { FC, useEffect, useState, FormEvent } from 'react'
import { useNodeSettings } from '../../../contexts/NodeSettingsContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { ManualTriggerNodeConfig } from '@/modules/process-builder/workflow/types/node-settings'

interface ManualTriggerSettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

type TriggerMechanism = 'USER' | 'GROUP' | 'SPECIFIC_GROUP' | 'NONE'

export const ManualTriggerSettings: FC<ManualTriggerSettingsProps> = ({
  nodeId,
  onValidationChange,
}) => {
  const { getNodeSettings, updateNodeSettings } = useNodeSettings()
  const nodeSettings = getNodeSettings<ManualTriggerNodeConfig>(nodeId)
  const [isValid, setIsValid] = useState(false)

  const [settings, setSettings] = useState({
    label: nodeSettings?.settings?.label || '',
    description: nodeSettings?.settings?.description || '',
    mechanism: (nodeSettings?.settings?.mechanism as TriggerMechanism) || 'NONE',
    specificGroupId: nodeSettings?.settings?.specificGroupId || {
      value: '',
      label: 'Selecione o grupo',
    },
    specificUserId: nodeSettings?.settings?.specificUserId || {
      value: '',
      label: 'Selecione o usuário',
    },
  })

  useEffect(() => {
    const newIsValid = Boolean(
      settings.label.trim() &&
        (settings.mechanism !== 'SPECIFIC_GROUP' || String(settings.specificGroupId || '').trim()),
    )
    setIsValid(newIsValid)
    onValidationChange?.(newIsValid)
  }, [settings, onValidationChange])

  const handleChange = (field: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [field]: value }
    setSettings(newSettings)

    updateNodeSettings(nodeId, {
      ...nodeSettings,
      settings: newSettings,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Trigger
        </Label>
        <Input
          id="label"
          type="text"
          placeholder="Ex: Iniciar Processo de Vendas"
          value={settings.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full"
        />
        {!settings.label.trim() && (
          <p className="text-xs text-red-500 mt-1">O nome do trigger é obrigatório</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva o propósito deste trigger..."
          value={settings.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mechanism" className="block text-sm font-medium text-gray-700 mb-1">
          Mecanismo de Disparo
        </Label>
        <Select
          title="Mecanismo de Disparo"
          options={[
            {
              label: 'Nenhum (Qualquer pessoa)',
              value: 'NONE',
            },
            {
              label: 'Usuário',
              value: 'USER',
            },
            {
              label: 'Grupo',
              value: 'GROUP',
            },
            {
              label: 'Para um grupo',
              value: 'SPECIFIC_GROUP',
            },
          ]}
          defaultOption={settings.mechanism}
          onValueChange={(value) => handleChange('mechanism', value)}
        />
      </div>

      {settings.mechanism === 'USER' && (
        <Select
          title="Usuário"
          options={[
            {
              label: 'Usuário 1',
              value: {
                value: 'USER_1',
                label: 'Usuário 1',
              },
            },
          ]}
          defaultOption={settings.specificUserId?.label || 'Selecione o usuário'}
          onValueChange={(value) => handleChange('specificUserId', value)}
        />
      )}
      {settings.mechanism === 'GROUP' && (
        <Select
          title="Grupo"
          options={[
            {
              label: 'Grupo 1',
              value: {
                value: 'GROUP_1',
                label: 'Grupo 1',
              },
            },
          ]}
          defaultOption={String(settings.specificGroupId.label)}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
      {settings.mechanism === 'SPECIFIC_GROUP' && (
        <Select
          title="Grupo"
          options={[
            {
              label: 'Grupo 1',
              value: {
                value: 'GROUP_1',
                label: 'Grupo 1',
              },
            },
          ]}
          defaultOption={String(settings.specificGroupId.label)}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
    </div>
  )
}
