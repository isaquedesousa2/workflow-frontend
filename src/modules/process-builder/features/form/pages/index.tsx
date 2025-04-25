import { createFileRoute } from '@tanstack/react-router'
import { FormBuilder } from './FormBuilder'
import { FormRules } from './FormRules'

export const Route = createFileRoute('/form-builder2/')({
  component: FormBuilder,
})

export const FormRulesRoute = createFileRoute('/form-builder2/rules')({
  component: FormRules,
})
