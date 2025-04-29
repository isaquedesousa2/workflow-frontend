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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useFormValidation } from '@/modules/process-builder/features/form-validation/contexts/FormValidationContext'

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
  openConditionalDialog: boolean
  setOpenConditionalDialog: (open: boolean) => void
}

interface ConditionRow extends Condition {
  id: string
}
interface Scenario {
  id: string
  type: 'activity' | 'field'
  conditions: ConditionRow[]
  groupType: 'AND' | 'OR'
}
interface ActionRow {
  id: string
  action: ValidationRule['action']
  fieldId: string
}

// Função auxiliar para garantir o tipo correto
function toGroupType(value: string): 'AND' | 'OR' {
  return value === 'OR' ? 'OR' : 'AND'
}

export function ValidationRuleBuilder({
  openConditionalDialog,
  setOpenConditionalDialog,
}: Omit<ValidationRuleBuilderProps, 'rules' | 'onAddRule' | 'onRemoveRule' | 'onEditRule'>) {
  const { rows } = useFormBuilder()
  const { nodes } = useWorkflowBuilder()
  const { state, updateValidation, addValidation } = useFormValidation()
  const nodeId = 'settings'
  const rules = state.validations.find((v) => v.nodeId === nodeId)?.rules || []

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
      groupType: 'AND',
    },
  ])
  // Estado para ações de acontecer e não acontecer
  const [thenActions, setThenActions] = useState<ActionRow[]>([
    { id: crypto.randomUUID(), action: 'show', fieldId: '' },
  ])
  const [elseActions, setElseActions] = useState<ActionRow[]>([])

  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null)

  // Adicionar estado para tipo de gatilho
  const [triggerType, setTriggerType] = useState<'activity' | 'rule'>('activity')

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
    // Se o gatilho for por atividade, não validar cenários de campo
    if (triggerType === 'activity') {
      if (!selectedActivity) {
        return { isValid: false, message: 'Selecione uma atividade' }
      }
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
    // Se for por regra, validar cenários normalmente
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
    let trigger: any
    if (triggerType === 'activity') {
      trigger = {
        type: 'activity',
        activityId: selectedActivity === 'all' ? undefined : selectedActivity,
        condition: {
          fieldId: thenActions[0].fieldId,
          value: true,
        },
      }
    } else {
      trigger = {
        type: 'rule',
        condition: {
          type: scenarios[0].groupType,
          conditions: scenarios[0].conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        },
      }
    }
    const newRule: ValidationRule = {
      condition: {
        type: 'AND',
        conditions: scenarios.map((scenario) => ({
          type: scenario.groupType || 'AND',
          conditions: scenario.conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        })),
      },
      action: thenActions[0].action,
      trigger,
      elseActions: elseActions.map(({ action, fieldId }) => ({ action, fieldId })),
    }
    if (rules.length === 0 && !state.validations.find((v) => v.nodeId === nodeId)) {
      addValidation({ nodeId, rules: [newRule] })
    } else {
      updateValidation(nodeId, [...rules, newRule])
    }
    resetForm()
  }

  const handleRemoveRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    updateValidation(nodeId, newRules)
  }

  const handleEditRule = (index: number, updatedRule?: ValidationRule) => {
    if (updatedRule) {
      const newRules = [...rules]
      newRules[index] = updatedRule
      updateValidation(nodeId, newRules)
    } else {
      const rule = rules[index]
      setEditingRuleIndex(index)
      // Mapear as condições da regra existente para o formato de cenários
      const mappedScenarios = rule.condition.conditions.map((cond) => {
        if ('type' in cond) {
          return {
            id: crypto.randomUUID(),
            type: 'field' as const,
            groupType: cond.type as 'AND' | 'OR',
            conditions: cond.conditions
              .filter((c): c is Condition => !('type' in c))
              .map((c) => ({
                id: crypto.randomUUID(),
                fieldId: c.fieldId,
                operator: c.operator,
                value: c.value,
              })),
          } satisfies Scenario
        }
        return {
          id: crypto.randomUUID(),
          type: 'field' as const,
          groupType: 'AND',
          conditions: [
            ...(!('type' in cond)
              ? [
                  {
                    id: crypto.randomUUID(),
                    fieldId: cond.fieldId,
                    operator: cond.operator,
                    value: cond.value,
                  },
                ]
              : []),
          ],
        } satisfies Scenario
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
      setElseActions((rule.elseActions || []).map((a) => ({ ...a, id: crypto.randomUUID() })))
      setSelectedActivity(rule.trigger?.activityId || 'all')
      setOpenConditionalDialog(true)
    }
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

  const handleUpdateRule = () => {
    const validation = validateRule()
    if (!validation.isValid) {
      console.error(validation.message)
      return
    }

    if (editingRuleIndex === null) return

    let trigger: any
    if (triggerType === 'activity') {
      trigger = {
        type: 'activity',
        activityId: selectedActivity === 'all' ? undefined : selectedActivity,
        condition: {
          fieldId: thenActions[0].fieldId,
          value: true,
        },
      }
    } else {
      trigger = {
        type: 'rule',
        condition: {
          type: scenarios[0].groupType,
          conditions: scenarios[0].conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        },
      }
    }

    const updatedRule: ValidationRule = {
      condition: {
        type: 'AND',
        conditions: scenarios.map((scenario) => ({
          type: scenario.groupType || 'AND',
          conditions: scenario.conditions.map((cond) => ({
            fieldId: cond.fieldId,
            operator: cond.operator,
            value: cond.value,
          })),
        })),
      },
      action: thenActions[0].action,
      trigger,
      elseActions: elseActions.map(({ action, fieldId }) => ({ action, fieldId })),
    }

    handleEditRule(editingRuleIndex, updatedRule)
    setEditingRuleIndex(null)
    resetForm()
    setOpenConditionalDialog(false)
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
        groupType: 'AND',
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
    <>
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
                  handleRemoveRule(ruleToDelete)
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
      <div className="flex overflow-hidden h-[calc(100vh-130px)]">
        <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-130px)]">
          <h2 className="text-xl font-bold mb-6">Regras de Validação</h2>
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
          <div className="mt-8">
            <Dialog open={openConditionalDialog} onOpenChange={setOpenConditionalDialog}>
              <DialogContent className="max-w-5xl flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Adicionar condicional em campo</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6 pt-0">
                  <div className="mb-6">
                    <p className="text-gray-500 mt-1">
                      Controle quais campos aparecerão neste formulário.
                    </p>
                  </div>
                  <div className="mb-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold">Quando validar</p>
                    </div>
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Label className="mr-2 font-medium">Tipo de gatilho:</Label>
                        <Select
                          value={triggerType}
                          onValueChange={(v) => setTriggerType(v as 'activity' | 'rule')}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue placeholder="Tipo de gatilho" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activity">Por atividade</SelectItem>
                            <SelectItem value="rule">Por regra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {triggerType === 'activity' ? (
                          <>
                            O gatilho será ativado quando uma atividade específica do workflow for
                            executada. Ideal para regras que dependem do andamento do fluxo.
                          </>
                        ) : (
                          <>
                            O gatilho será ativado quando as condições definidas abaixo forem
                            satisfeitas, independente da atividade do workflow. Ideal para regras
                            baseadas em valores de campos.
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      {triggerType === 'activity' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Label className="w-44">Atividade:</Label>
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
                          <p className="text-xs text-gray-500 mt-2 ml-1">
                            Se "Todas as atividades" for selecionada, a validação será aplicada em
                            todas as atividades do workflow.
                          </p>
                        </>
                      ) : (
                        <div className="border border-blue-100 rounded-lg bg-blue-50 p-3 mt-2">
                          <p className="text-xs text-blue-700 mb-2 font-medium">
                            Defina as condições do gatilho (todas devem ser verdadeiras para acionar
                            a regra):
                          </p>
                          {scenarios[0].conditions.map((cond, cidx) => (
                            <div key={cond.id} className="grid grid-cols-4 gap-2 mb-2">
                              <Select
                                value={cond.fieldId}
                                onValueChange={(v) =>
                                  updateConditionScenario(scenarios[0].id, cond.id, { fieldId: v })
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
                                  updateConditionScenario(scenarios[0].id, cond.id, {
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
                                  <SelectItem value="contains">Contém</SelectItem>
                                  <SelectItem value="notContains">Não contém</SelectItem>
                                  <SelectItem value="greaterThan">&gt;</SelectItem>
                                  <SelectItem value="lessThan">&lt;</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={cond.value.type}
                                onValueChange={(v) =>
                                  updateConditionScenario(scenarios[0].id, cond.id, {
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
                                    updateConditionScenario(scenarios[0].id, cond.id, {
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
                                    updateConditionScenario(scenarios[0].id, cond.id, {
                                      value: { type: 'static', staticValue: e.target.value },
                                    })
                                  }
                                  className="w-full bg-white"
                                  placeholder="Digite o valor"
                                />
                              )}
                              {scenarios[0].conditions.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0"
                                  onClick={() => removeConditionScenario(scenarios[0].id, cond.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addConditionScenario(scenarios[0].id)}
                          >
                            <Plus className="h-4 w-4" />
                            Adicionar condição
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
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
                  <div className="mb-4 border border-red-200 rounded-lg bg-red-50/30">
                    <div className="p-4">
                      <p className="font-semibold text-red-700 mb-3">
                        Se o cenário que você definiu{' '}
                        <span className="font-bold text-red-600">não acontecer</span>, então faça
                        isso
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
                </div>
                <DialogFooter className="sticky bottom-0 left-0 w-full bg-background border-t p-6 mt-0 z-10 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingRuleIndex(null)
                      resetForm()
                      setOpenConditionalDialog(false)
                      document.activeElement && (document.activeElement as HTMLElement).blur()
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
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}
