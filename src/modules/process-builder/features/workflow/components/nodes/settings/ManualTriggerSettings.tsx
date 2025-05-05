'use client'
import { FC, useEffect, useState, FormEvent } from 'react'
import { useNodeConfig } from '../../../contexts/NodeConfigContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { ManualTriggerNodeConfig } from '../../../types/node-settings'

interface ManualTriggerSettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

type TriggerMechanism = 'USER' | 'GROUP' | 'SPECIFIC_GROUP' | 'NONE'

export const ManualTriggerSettings: FC<ManualTriggerSettingsProps> = ({
  nodeId,
  onValidationChange,
}) => {
  const { getNodeConfig, updateNodeConfig } = useNodeConfig()
  const nodeConfig = getNodeConfig<ManualTriggerNodeConfig>(nodeId)

  useEffect(() => {
    const newIsValid = Boolean(
      nodeConfig?.label.trim() &&
        (nodeConfig?.mechanism !== 'SPECIFIC_GROUP' ||
          String(nodeConfig?.specificGroupId || '').trim()),
    )
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
          Nome do Trigger
        </Label>
        <Input
          id="label"
          type="text"
          placeholder="Ex: Iniciar Processo de Vendas"
          value={nodeConfig?.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full"
        />
        {!nodeConfig?.label.trim() && (
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
          value={nodeConfig?.description}
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
          defaultOption={nodeConfig?.mechanism}
          onValueChange={(value) => handleChange('mechanism', value)}
        />
      </div>

      {nodeConfig?.mechanism === 'USER' && (
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
      {nodeConfig?.mechanism === 'GROUP' && (
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
          defaultOption={String(nodeConfig?.specificGroupId?.label)}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
      {nodeConfig?.mechanism === 'SPECIFIC_GROUP' && (
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
          defaultOption={String(nodeConfig?.specificGroupId?.label)}
          onValueChange={(value) => handleChange('specificGroupId', value)}
        />
      )}
    </div>
  )
}
