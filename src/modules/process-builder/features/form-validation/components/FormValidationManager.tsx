import { useState, useEffect } from 'react'
import { useFormValidation } from '../hooks/useFormValidation'
import { ValidationRuleBuilder } from './ValidationRuleBuilder'
import { ValidationRule } from '@/modules/process-builder/features/form-validation/types'
import { useFormBuilder } from '@/modules/process-builder/features/form/contexts/FormBuilderContext'

export function FormValidationManager({
  openConditionalDialog,
  setOpenConditionalDialog,
}: {
  openConditionalDialog: boolean
  setOpenConditionalDialog: (open: boolean) => void
}) {

  return (
    <ValidationRuleBuilder
      openConditionalDialog={openConditionalDialog}
      setOpenConditionalDialog={setOpenConditionalDialog}
    />
  )
}
