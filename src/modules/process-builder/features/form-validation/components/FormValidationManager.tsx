import { useState, useEffect } from 'react'
import { useFormValidation } from '../hooks/useFormValidation'
import { ValidationRuleBuilder } from './ValidationRuleBuilder'
import { Node } from 'reactflow'
import { FormComponent } from '../../form/types'
import { ValidationRule } from '@/modules/process-builder/features/form-validation/types'

interface FormValidationManagerProps {
  node: Node
  formComponents: FormComponent[]
}

export function FormValidationManager({ node, formComponents }: FormValidationManagerProps) {
  const { addValidation, removeValidation, updateValidation, state } = useFormValidation()
  const [rules, setRules] = useState<ValidationRule[]>([])

  useEffect(() => {
    const existingValidation = state.validations.find((v) => v.nodeId === node.id)
    if (existingValidation) {
      setRules(existingValidation.rules)
    }
  }, [node.id, state.validations])

  const handleAddRule = (rule: ValidationRule) => {
    const newRules = [...rules, rule]
    setRules(newRules)
    updateValidation(node.id, newRules)
  }

  const handleRemoveRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules)
    updateValidation(node.id, newRules)
  }

  const handleEditRule = (index: number, updatedRule: ValidationRule) => {
    const newRules = [...rules]
    newRules[index] = updatedRule
    setRules(newRules)
    updateValidation(node.id, newRules)
  }

  return (
    <div className="p-16">
      <ValidationRuleBuilder
        rules={rules}
        onAddRule={handleAddRule}
        onRemoveRule={handleRemoveRule}
        onEditRule={handleEditRule}
      />
    </div>
  )
}
