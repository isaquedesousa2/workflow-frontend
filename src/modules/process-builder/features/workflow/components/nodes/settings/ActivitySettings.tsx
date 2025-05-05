import { FC, useEffect, useState } from 'react'
import { useNodeConfig } from '../../../contexts/NodeConfigContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { ActivityNodeConfig } from '../../../types/node-settings'

interface ActivitySettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

export const ActivitySettings: FC<ActivitySettingsProps> = ({ nodeId, onValidationChange }) => {
  const { getNodeConfig, updateNodeConfig } = useNodeConfig()
  const nodeConfig = getNodeConfig<ActivityNodeConfig>(nodeId)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const newIsValid = Boolean(nodeConfig?.label.trim())
    setIsValid(newIsValid)
    onValidationChange?.(newIsValid)
  }, [nodeConfig, onValidationChange])

  const handleChange = (field: string, value: any) => {
    updateNodeConfig(nodeId, {
      ...nodeConfig,
      [field]: value,
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
          value={nodeConfig?.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full"
        />
        {!nodeConfig?.label.trim() && (
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
          value={nodeConfig?.description}
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
          defaultOption={nodeConfig?.assigneeType}
          onValueChange={(value) => handleChange('assigneeType', value)}
        />
      </div>

      {nodeConfig?.assigneeType === 'USER' && (
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
          defaultOption={nodeConfig?.specificUserId?.label || 'Selecione o usuário'}
          onValueChange={(value) => handleChange('specificUserId', value)}
        />
      )}

      {nodeConfig?.assigneeType === 'GROUP' && (
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
          defaultOption={nodeConfig?.specificGroupId?.label || 'Selecione o grupo'}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}

      {nodeConfig?.assigneeType === 'SPECIFIC_GROUP' && (
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
          defaultOption={nodeConfig?.specificGroupId?.label || 'Selecione o grupo'}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
    </div>
  )
}
