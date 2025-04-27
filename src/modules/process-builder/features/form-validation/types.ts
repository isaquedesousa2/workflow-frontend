import { FormComponent } from '../form/types'
import { Node } from 'reactflow'

export type Condition = {
  fieldId: string
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan'
  value: {
    type: 'field' | 'static'
    fieldId?: string
    staticValue?: any
  }
}

export type ConditionGroup = {
  type: 'AND' | 'OR'
  conditions: (Condition | ConditionGroup)[]
}

export type ValidationRule = {
  condition: ConditionGroup
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'optional'
  trigger: {
    type: 'activity' | 'condition'
    activityId?: string
    condition?: {
      fieldId: string
      value: any
    }
  }
}

export type WorkflowValidation = {
  nodeId: string
  rules: ValidationRule[]
}

export type FormValidationState = {
  validations: WorkflowValidation[]
  currentActivityId?: string
}

export type FormValidationContextType = {
  state: FormValidationState
  addValidation: (validation: WorkflowValidation) => void
  removeValidation: (nodeId: string) => void
  updateValidation: (nodeId: string, rules: ValidationRule[]) => void
  setCurrentActivity: (activityId: string) => void
  getFieldState: (fieldId: string) => {
    isVisible: boolean
    isEnabled: boolean
    isRequired: boolean
  }
}

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string[]>
}
