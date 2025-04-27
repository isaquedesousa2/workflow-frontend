import { useFormValidation as useFormValidationContext } from '../contexts/FormValidationContext'
import { ValidationResult } from '../types'

export function useFormValidation() {
  const context = useFormValidationContext()

  const validateField = (
    fieldId: string,
    value: any,
    formValues: Record<string, any>,
  ): ValidationResult => {
    const fieldState = context.getFieldState(fieldId)
    const errors: string[] = []

    if (fieldState.isRequired && !value) {
      errors.push('Este campo é obrigatório')
    }

    if (!fieldState.isVisible) {
      return { isValid: true, errors: {} }
    }

    if (!fieldState.isEnabled) {
      return { isValid: true, errors: {} }
    }

    return {
      isValid: errors.length === 0,
      errors: { [fieldId]: errors },
    }
  }

  const validateForm = (formValues: Record<string, any>): ValidationResult => {
    const errors: Record<string, string[]> = {}
    let isValid = true

    Object.entries(formValues).forEach(([fieldId, value]) => {
      const result = validateField(fieldId, value, formValues)
      if (!result.isValid) {
        isValid = false
        errors[fieldId] = result.errors[fieldId]
      }
    })

    return {
      isValid,
      errors,
    }
  }

  return {
    ...context,
    validateField,
    validateForm,
  }
}
