import { createContext, useContext, ReactNode, useState } from 'react'
import { ValidationRule } from '../types'

interface FormValidationContextType {
  rules: ValidationRule[]
  addRule: (rule: ValidationRule) => void
  removeRule: (index: number) => void
  updateRule: (index: number, rule: ValidationRule) => void
  getFieldState: (fieldId: string) => {
    isVisible: boolean
    isEnabled: boolean
    isRequired: boolean
  }
}

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined)

export function FormValidationProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<ValidationRule[]>([])

  const addRule = (rule: ValidationRule) => {
    setRules((prevRules) => [...prevRules, rule])
  }

  const removeRule = (index: number) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, rule: ValidationRule) => {
    setRules((prevRules) => prevRules.map((r, i) => (i === index ? rule : r)))
  }

  const getFieldState = (fieldId: string) => {
    const defaultState = {
      isVisible: true,
      isEnabled: true,
      isRequired: false,
    }

    return rules.reduce((state, rule) => {
      if (rule.trigger?.condition?.fieldId === fieldId) {
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
      }
      return state
    }, defaultState)
  }

  return (
    <FormValidationContext.Provider
      value={{
        rules,
        addRule,
        removeRule,
        updateRule,
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
