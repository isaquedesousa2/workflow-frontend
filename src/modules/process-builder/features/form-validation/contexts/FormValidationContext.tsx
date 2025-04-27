import { createContext, useContext, useReducer, ReactNode } from 'react'
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

type Action =
  | { type: 'ADD_VALIDATION'; payload: WorkflowValidation }
  | { type: 'REMOVE_VALIDATION'; payload: string }
  | { type: 'UPDATE_VALIDATION'; payload: { nodeId: string; rules: ValidationRule[] } }
  | { type: 'SET_CURRENT_ACTIVITY'; payload: string }

function validationReducer(state: FormValidationState, action: Action): FormValidationState {
  switch (action.type) {
    case 'ADD_VALIDATION':
      return {
        ...state,
        validations: [...state.validations, action.payload],
      }
    case 'REMOVE_VALIDATION':
      return {
        ...state,
        validations: state.validations.filter((v) => v.nodeId !== action.payload),
      }
    case 'UPDATE_VALIDATION':
      return {
        ...state,
        validations: state.validations.map((v) =>
          v.nodeId === action.payload.nodeId ? { ...v, rules: action.payload.rules } : v,
        ),
      }
    case 'SET_CURRENT_ACTIVITY':
      return {
        ...state,
        currentActivityId: action.payload,
      }
    default:
      return state
  }
}

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined)

export function FormValidationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(validationReducer, initialState)

  const addValidation = (validation: WorkflowValidation) => {
    dispatch({ type: 'ADD_VALIDATION', payload: validation })
  }

  const removeValidation = (nodeId: string) => {
    dispatch({ type: 'REMOVE_VALIDATION', payload: nodeId })
  }

  const updateValidation = (nodeId: string, rules: ValidationRule[]) => {
    dispatch({ type: 'UPDATE_VALIDATION', payload: { nodeId, rules } })
  }

  const setCurrentActivity = (activityId: string) => {
    dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: activityId })
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

    const rules = currentValidations.rules.filter((r) => r.fieldId === fieldId)
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
