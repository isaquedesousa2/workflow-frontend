'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface CheckboxInputProps {
  field: FormField
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ field }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[field.name]

  const validationRules = {
    required: field.validation?.required ? `${field.label || 'Campo'} é obrigatório` : false,
  }

  return (
    <BaseInput field={field}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.id}
          {...register(field.name, validationRules)}
          disabled={field.validation?.readonly}
          className={cn(error && 'border-red-500')}
        />
        {field.label && (
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
    </BaseInput>
  )
}
