import { FC, useEffect, useState } from 'react'
import { useNodeSettings } from '../../../contexts/NodeSettingsContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { DecisionNodeConfig } from '@/modules/workflow-builder/types/node-settings'

interface DecisionSettingsProps {
  nodeId: string
  onValidationChange?: (isValid: boolean) => void
}

// Campos de exemplo do formulário - isso deve vir de um contexto ou API
const FORM_FIELDS = [
  { id: 'status', label: 'Status', value: 'status' },
  { id: 'prioridade', label: 'Prioridade', value: 'prioridade' },
  { id: 'categoria', label: 'Categoria', value: 'categoria' },
  { id: 'valor', label: 'Valor', value: 'valor' },
  { id: 'data', label: 'Data', value: 'data' },
]

const OPERATORS = [
  { id: '>', label: 'Maior que', value: '>' },
  { id: '<', label: 'Menor que', value: '<' },
  { id: '>=', label: 'Maior ou igual a', value: '>=' },
  { id: '<=', label: 'Menor ou igual a', value: '<=' },
  { id: '==', label: 'Igual a', value: '==' },
  { id: '!=', label: 'Diferente de', value: '!=' },
  { id: 'contains', label: 'Contém', value: 'contains' },
  { id: 'startsWith', label: 'Começa com', value: 'startsWith' },
  { id: 'endsWith', label: 'Termina com', value: 'endsWith' },
]

const COMPARISON_TYPES = [
  { id: 'value', label: 'Valor fixo', value: 'value' },
  { id: 'field', label: 'Outro campo', value: 'field' },
]

export const DecisionSettings: FC<DecisionSettingsProps> = ({ nodeId, onValidationChange }) => {
  const { getNodeSettings, updateNodeSettings } = useNodeSettings()
  const nodeSettings = getNodeSettings<DecisionNodeConfig>(nodeId)
  const [isValid, setIsValid] = useState(false)

  const [settings, setSettings] = useState({
    label: nodeSettings?.settings?.label || '',
    description: nodeSettings?.settings?.description || '',
    formField: nodeSettings?.settings?.formField || {
      id: '',
      label: '',
    },
    operator: nodeSettings?.settings?.operator || '==',
    comparisonType: nodeSettings?.settings?.comparisonType || 'value',
    comparisonValue: nodeSettings?.settings?.comparisonValue || '',
    comparisonField: nodeSettings?.settings?.comparisonField || {
      id: '',
      label: '',
    },
  })

  useEffect(() => {
    const newIsValid = Boolean(
      settings.label.trim() &&
        settings.formField.id &&
        settings.operator &&
        (settings.comparisonType === 'value'
          ? settings.comparisonValue.trim()
          : settings.comparisonField.id),
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

  const handleFormFieldChange = (value: string) => {
    const selectedField = FORM_FIELDS.find((field) => field.id === value)
    if (selectedField) {
      handleChange('formField', {
        id: selectedField.id,
        label: selectedField.label,
      })
    }
  }

  const handleComparisonFieldChange = (value: string) => {
    const selectedField = FORM_FIELDS.find((field) => field.id === value)
    if (selectedField) {
      handleChange('comparisonField', {
        id: selectedField.id,
        label: selectedField.label,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Decisão
        </Label>
        <Input
          id="label"
          type="text"
          placeholder="Ex: Aprovar Documento"
          value={settings.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full"
        />
        {!settings.label.trim() && (
          <p className="text-xs text-red-500 mt-1">O nome da decisão é obrigatório</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva a decisão..."
          value={settings.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full"
          rows={3}
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Campo do Formulário</Label>
        <Select
          options={FORM_FIELDS}
          value={settings.formField.id}
          onValueChange={handleFormFieldChange}
          placeholder="Selecione um campo"
          title="Campo do Formulário"
        />
        {!settings.formField.id && (
          <p className="text-xs text-red-500 mt-1">O campo do formulário é obrigatório</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Operador</Label>
        <Select
          options={OPERATORS}
          value={settings.operator}
          onValueChange={(value) => handleChange('operator', value)}
          placeholder="Selecione um operador"
          title="Operador"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Comparação</Label>
        <Select
          options={COMPARISON_TYPES}
          value={settings.comparisonType}
          onValueChange={(value) => handleChange('comparisonType', value)}
          placeholder="Selecione o tipo de comparação"
          title="Tipo de Comparação"
        />
      </div>

      {settings.comparisonType === 'value' ? (
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Valor de Comparação
          </Label>
          <Input
            type="text"
            placeholder="Digite o valor"
            value={settings.comparisonValue}
            onChange={(e) => handleChange('comparisonValue', e.target.value)}
            className="w-full"
          />
          {!settings.comparisonValue.trim() && (
            <p className="text-xs text-red-500 mt-1">O valor de comparação é obrigatório</p>
          )}
        </div>
      ) : (
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Campo de Comparação
          </Label>
          <Select
            options={FORM_FIELDS}
            value={settings.comparisonField.id}
            onValueChange={handleComparisonFieldChange}
            placeholder="Selecione um campo"
            title="Campo de Comparação"
          />
          {!settings.comparisonField.id && (
            <p className="text-xs text-red-500 mt-1">O campo de comparação é obrigatório</p>
          )}
        </div>
      )}
    </div>
  )
}
