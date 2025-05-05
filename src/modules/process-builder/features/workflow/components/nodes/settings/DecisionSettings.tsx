import { FC, useEffect, useState } from 'react'
import { useNodeConfig } from '../../../contexts/NodeConfigContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/Select'
import { DecisionNodeConfig } from '../../../types/node-settings'
import { Button } from '@/components/ui/button'

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
  const { getNodeConfig, updateNodeConfig } = useNodeConfig()
  const nodeConfig = getNodeConfig<DecisionNodeConfig>(nodeId)
  const [isValid, setIsValid] = useState(false)

  // Grupos de regras para SIM e NÃO
  const emptyRule = {
    formField: { id: '', label: '' },
    operator: '==',
    comparisonType: 'value',
    comparisonValue: '',
    comparisonField: { id: '', label: '' },
  }

  const fixRule = (rule: any) => ({
    ...rule,
    comparisonValue: rule.comparisonValue ?? '',
    comparisonField: rule.comparisonField ?? { id: '', label: '' },
  })
  const [rulesYes, setRulesYes] = useState<Array<typeof emptyRule>>(
    nodeConfig?.rulesYes && Array.isArray(nodeConfig.rulesYes)
      ? nodeConfig.rulesYes.map(fixRule)
      : [],
  )
  const [rulesNo, setRulesNo] = useState<Array<typeof emptyRule>>(
    nodeConfig?.rulesNo && Array.isArray(nodeConfig.rulesNo) ? nodeConfig.rulesNo.map(fixRule) : [],
  )

  useEffect(() => {
    const isValidRule = (r: any) => r && r.formField && r.operator && r.comparisonType
    const filteredYes = rulesYes.filter(isValidRule)
    const filteredNo = rulesNo.filter(isValidRule)
    const newIsValid = Boolean(filteredYes.length > 0 && filteredNo.length > 0)
    setIsValid(newIsValid)
    onValidationChange?.(newIsValid)
    // Salva as configurações e regras no node
    updateNodeConfig(nodeId, {
      ...nodeConfig,
      label: nodeConfig?.label || '',
      description: nodeConfig?.description || '',
      rulesYes: rulesYes,
      rulesNo: rulesNo,
    })
  }, [nodeConfig?.label, nodeConfig?.description, rulesYes, rulesNo, onValidationChange])

  const addRuleYes = () => setRulesYes([...rulesYes, { ...emptyRule }])
  const updateRuleYes = (idx: number, rule: typeof emptyRule) => {
    const updated = [...rulesYes]
    updated[idx] = rule
    setRulesYes(updated)
  }
  const removeRuleYes = (idx: number) => {
    const updated = [...rulesYes]
    updated.splice(idx, 1)
    setRulesYes(updated)
  }

  // Funções para regras NÃO
  const addRuleNo = () => setRulesNo([...rulesNo, { ...emptyRule }])
  const updateRuleNo = (idx: number, rule: typeof emptyRule) => {
    const updated = [...rulesNo]
    updated[idx] = rule
    setRulesNo(updated)
  }
  const removeRuleNo = (idx: number) => {
    const updated = [...rulesNo]
    updated.splice(idx, 1)
    setRulesNo(updated)
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
          value={nodeConfig?.label || ''}
          onChange={(e) => updateNodeConfig(nodeId, { ...nodeConfig, label: e.target.value })}
          className="w-full"
        />
        {!nodeConfig?.label?.trim() && (
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
          value={nodeConfig?.description || ''}
          onChange={(e) => updateNodeConfig(nodeId, { ...nodeConfig, description: e.target.value })}
          className="w-full"
          rows={3}
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Regras para o SIM</Label>
        {rulesYes.map((rule, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-4">
            <div className="grid grid-cols-4 gap-2 items-center border p-2 rounded-md bg-gray-50">
              <Select
                options={FORM_FIELDS}
                value={rule.formField.id}
                onValueChange={(value) => {
                  const selected = FORM_FIELDS.find((f) => f.id === value)
                  updateRuleYes(idx, { ...rule, formField: selected || { id: '', label: '' } })
                }}
                placeholder="Campo do formulário"
                title="Campo do formulário"
                className="col-span-1"
              />
              <Select
                options={OPERATORS}
                value={rule.operator}
                onValueChange={(value) => updateRuleYes(idx, { ...rule, operator: value })}
                placeholder="Operador"
                title="Operador"
                className="col-span-1"
              />
              <Select
                options={COMPARISON_TYPES}
                value={rule.comparisonType}
                onValueChange={(value) => updateRuleYes(idx, { ...rule, comparisonType: value })}
                placeholder="Tipo de comparação"
                title="Tipo de comparação"
                className="col-span-1"
              />
              {rule.comparisonType === 'value' ? (
                <Input
                  value={rule.comparisonValue}
                  onChange={(e) => updateRuleYes(idx, { ...rule, comparisonValue: e.target.value })}
                  placeholder="Valor de comparação"
                  className="col-span-1"
                />
              ) : (
                <Select
                  options={FORM_FIELDS}
                  value={rule.comparisonField?.id || ''}
                  onValueChange={(value) => {
                    const selected = FORM_FIELDS.find((f) => f.id === value)
                    updateRuleYes(idx, {
                      ...rule,
                      comparisonField: selected || { id: '', label: '' },
                    })
                  }}
                  placeholder="Campo de comparação"
                  title="Campo de comparação"
                  className="col-span-1"
                />
              )}
            </div>
            <Button variant="destructive" size="icon" onClick={() => removeRuleYes(idx)}>
              -
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addRuleYes}>
          Adicionar regra SIM
        </Button>
      </div>

      {/* Grupos de regras para NÃO */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Regras para o NÃO</Label>
        {rulesNo.map((rule, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-4">
            <div className="grid grid-cols-4 gap-2 items-center border p-2 rounded-md bg-gray-50">
              <Select
                options={FORM_FIELDS}
                value={rule.formField.id}
                onValueChange={(value) => {
                  const selected = FORM_FIELDS.find((f) => f.id === value)
                  updateRuleNo(idx, { ...rule, formField: selected || { id: '', label: '' } })
                }}
                placeholder="Campo do formulário"
                title="Campo do formulário"
                className="col-span-1"
              />
              <Select
                options={OPERATORS}
                value={rule.operator}
                onValueChange={(value) => updateRuleNo(idx, { ...rule, operator: value })}
                placeholder="Operador"
                title="Operador"
                className="col-span-1"
              />
              <Select
                options={COMPARISON_TYPES}
                value={rule.comparisonType}
                onValueChange={(value) => updateRuleNo(idx, { ...rule, comparisonType: value })}
                placeholder="Tipo de comparação"
                title="Tipo de comparação"
                className="col-span-1"
              />
              {rule.comparisonType === 'value' ? (
                <Input
                  value={rule.comparisonValue}
                  onChange={(e) => updateRuleNo(idx, { ...rule, comparisonValue: e.target.value })}
                  placeholder="Valor de comparação"
                  className="col-span-1"
                />
              ) : (
                <Select
                  options={FORM_FIELDS}
                  value={rule.comparisonField?.id || ''}
                  onValueChange={(value) => {
                    const selected = FORM_FIELDS.find((f) => f.id === value)
                    updateRuleNo(idx, {
                      ...rule,
                      comparisonField: selected || { id: '', label: '' },
                    })
                  }}
                  placeholder="Campo de comparação"
                  title="Campo de comparação"
                  className="col-span-1"
                />
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeRuleNo(idx)}
              className="col-span-1 justify-self-end"
            >
              -
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addRuleNo}>
          Adicionar regra NÃO
        </Button>
      </div>
    </div>
  )
}
