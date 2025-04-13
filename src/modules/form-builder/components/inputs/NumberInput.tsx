'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface NumberInputProps {
  field: FormField
}

export const NumberInput: React.FC<NumberInputProps> = ({ field }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[field.name]

  const validationRules = {
    required: field.validation?.required ? `${field.label || 'Campo'} é obrigatório` : false,
    min:
      field.validation?.min !== undefined
        ? {
            value: field.validation.min,
            message: `Valor mínimo é ${field.validation.min}`,
          }
        : undefined,
    max:
      field.validation?.max !== undefined
        ? {
            value: field.validation.max,
            message: `Valor máximo é ${field.validation.max}`,
          }
        : undefined,
    valueAsNumber: true,
  }

  return (
    <BaseInput field={field}>
      {field.label && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        id={field.id}
        {...register(field.name, validationRules)}
        type="number"
        placeholder={field.placeholder}
        disabled={field.validation?.readonly}
        min={field.validation?.min}
        max={field.validation?.max}
        step={field.validation?.step}
        className={cn(error && 'border-red-500')}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
    </BaseInput>
  )
}
