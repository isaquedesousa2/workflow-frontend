import { useState } from 'react'
import { ValidationRule, Condition, ConditionGroup } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormBuilder } from '../../form/contexts/FormBuilderContext'
import { useWorkflowBuilder } from '../../workflow/contexts/WorkflowBuilderContext'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Asterisk,
  CircleDot,
  X,
  Pencil,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function renderConditionText(condition: ConditionGroup, formFields: any[]): string {
  if (condition.conditions.length === 0) return ''

  const getOperatorText = (operator: string) => {
    switch (operator) {
      case 'equals':
        return 'é igual a'
      case 'notEquals':
        return 'é diferente de'
      case 'contains':
        return 'contém'
      case 'notContains':
        return 'não contém'
      case 'greaterThan':
        return 'é maior que'
      case 'lessThan':
        return 'é menor que'
      default:
        return operator
    }
  }

  const getFieldName = (fieldId: string | undefined) => {
    if (!fieldId) return 'Campo não definido'
    const field = formFields.find((f) => f.id === fieldId)
    return field ? field.label || field.name || fieldId : fieldId
  }

  const conditions = condition.conditions.map((c) => {
    if ('type' in c) {
      return `(${renderConditionText(c, formFields)})`
    }
    const fieldName = getFieldName(c.fieldId)
    const operatorText = getOperatorText(c.operator)
    const valueText = c.value.type === 'field' ? getFieldName(c.value.fieldId) : c.value.staticValue

    return `${fieldName} ${operatorText} ${valueText}`
  })

  return conditions.join(` ${condition.type === 'AND' ? 'E' : 'OU'} `)
}

function getActionIcon(action: ValidationRule['action']) {
  switch (action) {
    case 'show':
      return <Eye className="h-4 w-4" />
    case 'hide':
      return <EyeOff className="h-4 w-4" />
    case 'enable':
      return <Unlock className="h-4 w-4" />
    case 'disable':
      return <Lock className="h-4 w-4" />
    case 'require':
      return <Asterisk className="h-4 w-4" />
    case 'optional':
      return <CircleDot className="h-4 w-4" />
  }
}

function getActionLabel(action: ValidationRule['action']) {
  switch (action) {
    case 'show':
      return 'Mostrar'
    case 'hide':
      return 'Ocultar'
    case 'enable':
      return 'Habilitar'
    case 'disable':
      return 'Desabilitar'
    case 'require':
      return 'Obrigatório'
    case 'optional':
      return 'Opcional'
  }
}

interface ValidationRuleBuilderProps {
  onAddRule: (rule: ValidationRule) => void
  onRemoveRule: (index: number) => void
  onEditRule: (index: number, rule: ValidationRule) => void
  rules: ValidationRule[]
}

interface ConditionRow extends Condition {
  id: string
}
interface Scenario {
  id: string
  type: 'activity' | 'field'
  conditions: ConditionRow[]
}
interface ActionRow {
  id: string
  action: ValidationRule['action']
  fieldId: string
}

export function ValidationRuleBuilder({
  onAddRule,
  onRemoveRule,
  onEditRule,
  rules,
}: ValidationRuleBuilderProps) {
  const { rows } = useFormBuilder()
  const { nodes } = useWorkflowBuilder()
  const [conditionGroup, setConditionGroup] = useState<ConditionGroup>({
    type: 'AND',
    conditions: [],
  })
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<string>('all')

  const formFields = rows.flatMap((row) =>
    row.components.filter(
      (component): component is NonNullable<typeof component> => component !== null,
    ),
  )

  const activityNodes = nodes.filter((node) => node.type === 'activityNode')

  // Estado para múltiplos cenários
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: crypto.randomUUID(),
      type: 'field',
      conditions: [
        {
          id: crypto.randomUUID(),
          fieldId: '',
          operator: 'equals',
          value: { type: 'static', staticValue: '' },
        },
      ],
    },
  ])
  // Estado para ações de acontecer e não acontecer
  const [thenActions, setThenActions] = useState<ActionRow[]>([
    { id: crypto.randomUUID(), action: 'show', fieldId: '' },
  ])
  const [elseActions, setElseActions] = useState<ActionRow[]>([])

  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null)

  const updateCondition = (index: number, condition: Condition) => {
    const newConditions = [...conditionGroup.conditions]
    newConditions[index] = condition
    setConditionGroup({
      ...conditionGroup,
      conditions: newConditions,
    })
  }

  const updateGroup = (index: number, group: ConditionGroup) => {
    const newConditions = [...conditionGroup.conditions]
    newConditions[index] = group
    setConditionGroup({
      ...conditionGroup,
      conditions: newConditions,
    })
  }

  const removeCondition = (index: number) => {
    setConditionGroup({
      ...conditionGroup,
      conditions: conditionGroup.conditions.filter((_, i) => i !== index),
    })
  }

  const validateRule = () => {
    // Validar cenários
    for (const scenario of scenarios) {
      if (scenario.type === 'field') {
        for (const condition of scenario.conditions) {
          if (!condition.fieldId) {
            return { isValid: false, message: 'Selecione um campo para a condição' }
          }
          if (!condition.operator) {
            return { isValid: false, message: 'Selecione um operador para a condição' }
          }
          if (condition.value.type === 'static' && !condition.value.staticValue) {
            return { isValid: false, message: 'Digite um valor para a condição' }
          }
          if (condition.value.type === 'field' && !condition.value.fieldId) {
            return { isValid: false, message: 'Selecione um campo para comparar' }
          }
        }
      } else if (scenario.type === 'activity') {
        if (!scenario.conditions[0]?.fieldId) {
          return { isValid: false, message: 'Selecione uma atividade para a condição' }
        }
        if (!scenario.conditions[0]?.value.staticValue) {
          return { isValid: false, message: 'Selecione um status para a atividade' }
        }
      }
    }

    // Validar ações
    for (const action of thenActions) {
      if (!action.fieldId) {
        return { isValid: false, message: 'Selecione um campo para a ação' }
      }
    }

    for (const action of elseActions) {
      if (!action.fieldId) {
        return { isValid: false, message: 'Selecione um campo para a ação' }
      }
    }

    return { isValid: true, message: '' }
  }

  const handleAddRule = () => {
    const validation = validateRule()
    if (!validation.isValid) {
      console.error(validation.message)
      return
    }

    if (scenarios.length === 0) return

    const newRule: ValidationRule = {
      condition: {
        type: 'AND',
        conditions: scenarios.map((scenario) => ({
          type: 'AND',
          conditions: scenario.conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        })),
      },
      action: thenActions[0].action,
      trigger: {
        type: 'activity',
        activityId: selectedActivity === 'all' ? undefined : selectedActivity,
      },
    }

    onAddRule(newRule)
    resetForm()
  }

  const removeScenario = (sid: string) => setScenarios(scenarios.filter((s) => s.id !== sid))
  const addConditionScenario = (sid: string) =>
    setScenarios(
      scenarios.map((s) =>
        s.id === sid
          ? {
              ...s,
              conditions: [
                ...s.conditions,
                {
                  id: crypto.randomUUID(),
                  fieldId: '',
                  operator: 'equals',
                  value: { type: 'static', staticValue: '' },
                },
              ],
            }
          : s,
      ),
    )
  const removeConditionScenario = (sid: string, cid: string) =>
    setScenarios(
      scenarios.map((s) =>
        s.id === sid ? { ...s, conditions: s.conditions.filter((c) => c.id !== cid) } : s,
      ),
    )
  const updateConditionScenario = (sid: string, cid: string, cond: Partial<ConditionRow>) =>
    setScenarios(
      scenarios.map((s) =>
        s.id === sid
          ? {
              ...s,
              conditions: s.conditions.map((c) =>
                c.id === cid ? { ...c, ...cond, value: { ...c.value, ...cond.value } } : c,
              ),
            }
          : s,
      ),
    )

  // Funções para ações
  const addThenAction = () =>
    setThenActions([...thenActions, { id: crypto.randomUUID(), action: 'show', fieldId: '' }])
  const removeThenAction = (id: string) => setThenActions(thenActions.filter((a) => a.id !== id))
  const updateThenAction = (id: string, data: Partial<ActionRow>) =>
    setThenActions(thenActions.map((a) => (a.id === id ? { ...a, ...data } : a)))
  const addElseAction = () =>
    setElseActions([...elseActions, { id: crypto.randomUUID(), action: 'show', fieldId: '' }])
  const removeElseAction = (id: string) => setElseActions(elseActions.filter((a) => a.id !== id))
  const updateElseAction = (id: string, data: Partial<ActionRow>) =>
    setElseActions(elseActions.map((a) => (a.id === id ? { ...a, ...data } : a)))

  const handleEditRule = (index: number) => {
    const rule = rules[index]
    setEditingRuleIndex(index)

    // Mapear as condições da regra existente para o formato de cenários
    const mappedScenarios = rule.condition.conditions.map((cond) => {
      if ('type' in cond) {
        return {
          id: crypto.randomUUID(),
          type: 'field' as const,
          conditions: cond.conditions.map((c) => ({
            id: crypto.randomUUID(),
            fieldId: c.fieldId,
            operator: c.operator,
            value: c.value,
          })),
        }
      }
      return {
        id: crypto.randomUUID(),
        type: 'field' as const,
        conditions: [
          {
            id: crypto.randomUUID(),
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          },
        ],
      }
    })

    setScenarios(mappedScenarios)

    // Configurar as ações do "acontecer"
    const targetFieldId = rule.trigger.condition?.fieldId || ''
    setThenActions([
      {
        id: crypto.randomUUID(),
        action: rule.action,
        fieldId: targetFieldId,
      },
    ])

    setElseActions([])
    setSelectedActivity(rule.trigger?.activityId || 'all')
  }

  const handleUpdateRule = () => {
    const validation = validateRule()
    if (!validation.isValid) {
      console.error(validation.message)
      return
    }

    if (editingRuleIndex === null) return

    const updatedRule: ValidationRule = {
      condition: {
        type: 'AND',
        conditions: scenarios.map((scenario) => ({
          type: 'AND',
          conditions: scenario.conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        })),
      },
      action: thenActions[0].action,
      trigger: {
        type: 'activity',
        activityId: selectedActivity === 'all' ? undefined : selectedActivity,
        condition: {
          fieldId: thenActions[0].fieldId,
          value: true,
        },
      },
    }

    onEditRule(editingRuleIndex, updatedRule)
    setEditingRuleIndex(null)
    resetForm()
  }

  const resetForm = () => {
    setScenarios([
      {
        id: crypto.randomUUID(),
        type: 'field',
        conditions: [
          {
            id: crypto.randomUUID(),
            fieldId: '',
            operator: 'equals',
            value: { type: 'static', staticValue: '' },
          },
        ],
      },
    ])
    setThenActions([{ id: crypto.randomUUID(), action: 'show', fieldId: '' }])
    setElseActions([])
    setSelectedActivity('all')
    setEditingRuleIndex(null)
  }

  const renderCondition = (condition: Condition | ConditionGroup, index: number) => {
    if ('type' in condition) {
      return (
        <div key={index} className="border-l-2 border-gray-300 pl-4 ml-4">
          <div className="flex items-center gap-2 mb-2">
            <Select
              value={condition.type}
              onValueChange={(v) => updateGroup(index, { ...condition, type: v as 'AND' | 'OR' })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">E</SelectItem>
                <SelectItem value="OR">OU</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {condition.conditions.map((c, i) => renderCondition(c, i))}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newConditions = [...condition.conditions]
                newConditions.push({
                  fieldId: '',
                  operator: 'equals',
                  value: {
                    type: 'static',
                    staticValue: '',
                  },
                })
                updateGroup(index, { ...condition, conditions: newConditions })
              }}
            >
              <Plus className="h-4 w-4" />
              Adicionar Condição
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newConditions = [...condition.conditions]
                newConditions.push({
                  type: 'AND',
                  conditions: [],
                })
                updateGroup(index, { ...condition, conditions: newConditions })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Grupo
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div key={index} className="flex items-center gap-2 mb-2">
        <Select
          value={condition.fieldId}
          onValueChange={(v) => updateCondition(index, { ...condition, fieldId: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Campo" />
          </SelectTrigger>
          <SelectContent>
            {formFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label || field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={condition.operator}
          onValueChange={(v) => updateCondition(index, { ...condition, operator: v as any })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Operador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Igual a</SelectItem>
            <SelectItem value="notEquals">Diferente de</SelectItem>
            <SelectItem value="contains">Contém</SelectItem>
            <SelectItem value="notContains">Não contém</SelectItem>
            <SelectItem value="greaterThan">Maior que</SelectItem>
            <SelectItem value="lessThan">Menor que</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={condition.value.type}
          onValueChange={(v) =>
            updateCondition(index, { ...condition, value: { type: v as 'field' | 'static' } })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static">Valor Fixo</SelectItem>
            <SelectItem value="field">Outro Campo</SelectItem>
          </SelectContent>
        </Select>

        {condition.value.type === 'field' ? (
          <Select
            value={condition.value.fieldId}
            onValueChange={(v) =>
              updateCondition(index, { ...condition, value: { ...condition.value, fieldId: v } })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Campo" />
            </SelectTrigger>
            <SelectContent>
              {formFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label || field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={condition.value.staticValue}
            onChange={(e) =>
              updateCondition(index, {
                ...condition,
                value: { ...condition.value, staticValue: e.target.value },
              })
            }
            placeholder="Valor"
            className="w-40"
          />
        )}

        <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {/* Lista de regras à esquerda */}
      <div>
        <h2 className="text-xl font-bold">Regras de Validação</h2>
      </div>
      <div className="w-1/2 pr-8">
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <Card key={index} className="border-l-4 border-blue-500">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {renderConditionText(rule.condition, formFields)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditRule(index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setRuleToDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2">
                  {getActionIcon(rule.action)}
                  <span className="text-sm">{getActionLabel(rule.action)} campo</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={ruleToDelete !== null} onOpenChange={() => setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a regra de validação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (ruleToDelete !== null) {
                  onRemoveRule(ruleToDelete)
                  if (editingRuleIndex === ruleToDelete) {
                    setEditingRuleIndex(null)
                    resetForm()
                  }
                  setRuleToDelete(null)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed right-0 top-0 w-1/2 h-screen overflow-y-auto p-6 bg-white border-l">
        <div className="mb-6 mt-36">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Adicionar condicional em campo <HelpCircle className="h-5 w-5 text-gray-400" />
          </h2>
          <p className="text-gray-500 mt-1">Controle quais campos aparecerão neste formulário.</p>
        </div>

        {/* Seleção da atividade */}
        <div className="mb-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Quando validar</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma atividade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as atividades</SelectItem>
                {activityNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.data.label || node.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Se "Todas as atividades" for selecionada, a validação será aplicada em todas as
            atividades do workflow.
          </p>
        </div>

        {/* Cenários */}
        {scenarios.map((scenario, sidx) => (
          <div key={scenario.id} className="mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">Primeiro, defina o cenário</p>
              </div>

              {scenario.type === 'field' ? (
                scenario.conditions.map((cond, cidx) => (
                  <div key={cond.id} className="grid grid-cols-4 gap-2 mb-2">
                    <Select
                      value={cond.fieldId}
                      onValueChange={(v) =>
                        updateConditionScenario(scenario.id, cond.id, { fieldId: v })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Selecione um campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {formFields.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.label || f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={cond.operator}
                      onValueChange={(v) =>
                        updateConditionScenario(scenario.id, cond.id, { operator: v as any })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Operador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">=</SelectItem>
                        <SelectItem value="notEquals">≠</SelectItem>
                        <SelectItem value="contains">Contém</SelectItem>
                        <SelectItem value="notContains">Não contém</SelectItem>
                        <SelectItem value="greaterThan">&gt;</SelectItem>
                        <SelectItem value="lessThan">&lt;</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={cond.value.type}
                      onValueChange={(v) =>
                        updateConditionScenario(scenario.id, cond.id, {
                          value: {
                            type: v as 'static' | 'field',
                            ...(v === 'static' ? { staticValue: '' } : { fieldId: '' }),
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Tipo de valor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Valor Padrão</SelectItem>
                        <SelectItem value="field">Outro Campo</SelectItem>
                      </SelectContent>
                    </Select>

                    {cond.value.type === 'field' ? (
                      <Select
                        value={cond.value.fieldId}
                        onValueChange={(v) =>
                          updateConditionScenario(scenario.id, cond.id, {
                            value: { ...cond.value, fieldId: v },
                          })
                        }
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Selecione um campo" />
                        </SelectTrigger>
                        <SelectContent>
                          {formFields.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.label || f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={cond.value.staticValue ?? ''}
                        onChange={(e) =>
                          updateConditionScenario(scenario.id, cond.id, {
                            value: { type: 'static', staticValue: e.target.value },
                          })
                        }
                        className="w-full bg-white"
                        placeholder="Digite o valor"
                      />
                    )}

                    {scenario.conditions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => removeConditionScenario(scenario.id, cond.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Select
                    value={scenario.conditions[0]?.fieldId || ''}
                    onValueChange={(v) =>
                      updateConditionScenario(scenario.id, scenario.conditions[0].id, {
                        fieldId: v,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione uma atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityNodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.data.label || node.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={scenario.conditions[0]?.operator || 'equals'}
                    onValueChange={(v) =>
                      updateConditionScenario(scenario.id, scenario.conditions[0].id, {
                        operator: v as any,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Operador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">=</SelectItem>
                      <SelectItem value="notEquals">≠</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={scenario.conditions[0]?.value.staticValue || ''}
                    onValueChange={(v) =>
                      updateConditionScenario(scenario.id, scenario.conditions[0].id, {
                        value: { type: 'static', staticValue: v },
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="blocked">Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {scenarios.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => removeScenario(scenario.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="mt-3">
                <Button variant="outline" onClick={() => addConditionScenario(scenario.id)}>
                  <Plus className="h-4 w-4" />
                  Adicionar condição
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Ações - acontecer */}
        <div className="mb-4 border border-green-200 rounded-lg bg-green-50/30">
          <div className="p-4">
            <p className="font-semibold text-green-700 mb-3">
              Se o cenário que você definiu{' '}
              <span className="font-bold text-green-600">acontecer</span>, faça isso
            </p>
            {thenActions.map((a, idx) => (
              <div key={a.id} className="grid grid-cols-2 gap-2 mb-2">
                <Select
                  value={a.action}
                  onValueChange={(v) => updateThenAction(a.id, { action: v as any })}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Mostrar</SelectItem>
                    <SelectItem value="hide">Ocultar</SelectItem>
                    <SelectItem value="enable">Habilitar</SelectItem>
                    <SelectItem value="disable">Desabilitar</SelectItem>
                    <SelectItem value="require">Obrigatório</SelectItem>
                    <SelectItem value="optional">Opcional</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={a.fieldId}
                  onValueChange={(v) => updateThenAction(a.id, { fieldId: v })}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione um campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {formFields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label || f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {thenActions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => removeThenAction(a.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addThenAction}>
              <Plus className="h-4 w-4" />
              Adicionar ação
            </Button>
          </div>
        </div>

        {/* Ações - não acontecer */}
        <div className="mb-4 border border-red-200 rounded-lg bg-red-50/30">
          <div className="p-4">
            <p className="font-semibold text-red-700 mb-3">
              Se o cenário que você definiu{' '}
              <span className="font-bold text-red-600">não acontecer</span>, então faça isso
            </p>
            {elseActions.map((a, idx) => (
              <div key={a.id} className="grid grid-cols-2 gap-2 mb-2">
                <Select
                  value={a.action}
                  onValueChange={(v) => updateElseAction(a.id, { action: v as any })}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Mostrar</SelectItem>
                    <SelectItem value="hide">Ocultar</SelectItem>
                    <SelectItem value="enable">Habilitar</SelectItem>
                    <SelectItem value="disable">Desabilitar</SelectItem>
                    <SelectItem value="require">Obrigatório</SelectItem>
                    <SelectItem value="optional">Opcional</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={a.fieldId}
                  onValueChange={(v) => updateElseAction(a.id, { fieldId: v })}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione um campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {formFields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label || f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {elseActions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => removeElseAction(a.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addElseAction}>
              <Plus className="h-4 w-4" />
              Adicionar ação
            </Button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setEditingRuleIndex(null)
              resetForm()
            }}
          >
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 text-white"
            onClick={editingRuleIndex !== null ? handleUpdateRule : handleAddRule}
            disabled={!validateRule().isValid}
          >
            {editingRuleIndex !== null ? 'Atualizar condicional' : 'Adicionar condicional'}
          </Button>
        </div>
      </div>
    </div>
  )
}
