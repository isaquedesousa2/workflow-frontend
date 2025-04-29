import { createContext, useContext, ReactNode, useState } from 'react'
import {
  FormValidationContextType,
  FormValidationState,
  ValidationRule,
  WorkflowValidation,
} from '../types'

const initialState: FormValidationState = {
  validations: [],
  currentActivityId: undefined,
}

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined)

export function FormValidationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState)

  const addValidation = (validation: WorkflowValidation) => {
    setState((prevState) => ({
      ...prevState,
      validations: [...prevState.validations, validation],
    }))
  }

  const removeValidation = (nodeId: string) => {
    setState((prevState) => ({
      ...prevState,
      validations: prevState.validations.filter((v) => v.nodeId !== nodeId),
    }))
  }

  const updateValidation = (nodeId: string, rules: ValidationRule[]) => {
    setState((prevState) => ({
      ...prevState,
      validations: prevState.validations.map((v) =>
        v.nodeId === nodeId ? { ...v, rules } : v,
      ),
    }))
  }

  const setCurrentActivity = (activityId: string) => {
    setState((prevState) => ({
      ...prevState,
      currentActivityId: activityId,
    }))
  }

  const getFieldState = (fieldId: string) => {
    const currentValidations = state.validations.find((v) => v.nodeId === state.currentActivityId)

    if (!currentValidations) {
      return {
        isVisible: true,
        isEnabled: true,
        isRequired: false,
      }
    }

    const rules = currentValidations.rules.filter((r) => r.trigger?.condition?.fieldId === fieldId)
    const defaultState = {
      isVisible: true,
      isEnabled: true,
      isRequired: false,
    }

    return rules.reduce((state, rule) => {
      switch (rule.action) {
        case 'show':
          return { ...state, isVisible: true }
        case 'hide':
          return { ...state, isVisible: false }
        case 'enable':
          return { ...state, isEnabled: true }
        case 'disable':
          return { ...state, isEnabled: false }
        case 'require':
          return { ...state, isRequired: true }
        case 'optional':
          return { ...state, isRequired: false }
        default:
          return state
      }
    }, defaultState)
  }

  return (
    <FormValidationContext.Provider
      value={{
        state,
        addValidation,
        removeValidation,
        updateValidation,
        setCurrentActivity,
        getFieldState,
      }}
    >
      {children}
    </FormValidationContext.Provider>
  )
}

export function useFormValidation() {
  const context = useContext(FormValidationContext)
  if (context === undefined) {
    throw new Error('useFormValidation must be used within a FormValidationProvider')
  }
  return context
}
