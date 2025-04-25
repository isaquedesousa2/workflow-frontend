import { FC, useEffect, useState } from 'react'
import { useNodeSettings } from '../../../contexts/NodeSettingsContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { ActivityNodeConfig } from '@/modules/process-builder/workflow/types/node-settings'

interface ActivitySettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

type AssigneeType = 'USER' | 'GROUP' | 'SPECIFIC_GROUP' | 'NONE'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export const ActivitySettings: FC<ActivitySettingsProps> = ({ nodeId, onValidationChange }) => {
  const { getNodeSettings, updateNodeSettings } = useNodeSettings()
  const nodeSettings = getNodeSettings<ActivityNodeConfig>(nodeId)
  const [isValid, setIsValid] = useState(false)

  const [settings, setSettings] = useState({
    label: nodeSettings?.settings?.label || '',
    description: nodeSettings?.settings?.description || '',
    assigneeType: (nodeSettings?.settings?.assigneeType as AssigneeType) || 'NONE',
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
    const newIsValid = Boolean(settings.label.trim())
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
          Nome da Atividade
        </Label>
        <Input
          id="label"
          type="text"
          placeholder="Ex: Revisar Documento"
          value={settings.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full"
        />
        {!settings.label.trim() && (
          <p className="text-xs text-red-500 mt-1">O nome da atividade é obrigatório</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva a atividade..."
          value={settings.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigneeType" className="block text-sm font-medium text-gray-700 mb-1">
          Responsável
        </Label>
        <Select
          title="Responsável"
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
          defaultOption={settings.assigneeType}
          onValueChange={(value) => handleChange('assigneeType', value)}
        />
      </div>

      {settings.assigneeType === 'USER' && (
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

      {settings.assigneeType === 'GROUP' && (
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
          defaultOption={settings.specificGroupId?.label || 'Selecione o grupo'}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}

      {settings.assigneeType === 'SPECIFIC_GROUP' && (
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
          defaultOption={settings.specificGroupId?.label || 'Selecione o grupo'}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
    </div>
  )
}
