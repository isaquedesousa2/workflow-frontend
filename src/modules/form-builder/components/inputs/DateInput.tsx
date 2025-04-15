'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface DateInputProps {
  field: FormField
}

export const DateInput: React.FC<DateInputProps> = ({ field }) => {
  const formContext = useFormContext()

  if (!formContext) {
    return (
      <BaseInput field={field}>
        {field.label && (
          <Label
            htmlFor={field.id}
            className={cn(field.style?.labelColor && `text-${field.style.labelColor}`)}
          >
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Input
          id={field.id}
          type="date"
          placeholder={field.placeholder}
          disabled={field.validation?.readonly}
          className={cn(
            field.style?.inputColor && `text-${field.style.inputColor}`,
            field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
            field.style?.borderColor && `border-${field.style.borderColor}`,
            field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
            field.style?.padding && `p-${field.style.padding}`,
            field.style?.fontSize && `text-${field.style.fontSize}`,
          )}
        />
      </BaseInput>
    )
  }

  const {
    register,
    formState: { errors },
  } = formContext
  const error = errors[field.name]

  const validationRules = {
    required: field.validation?.required ? `${field.label || 'Campo'} é obrigatório` : false,
    min: field.validation?.minDate
      ? {
          value: field.validation.minDate,
          message: `Data mínima: ${field.validation.minDate}`,
        }
      : undefined,
    max: field.validation?.maxDate
      ? {
          value: field.validation.maxDate,
          message: `Data máxima: ${field.validation.maxDate}`,
        }
      : undefined,
  }

  return (
    <BaseInput field={field}>
      {field.label && (
        <Label
          htmlFor={field.id}
          className={cn(field.style?.labelColor && `text-${field.style.labelColor}`)}
        >
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        id={field.id}
        type="date"
        {...register(field.name, validationRules)}
        placeholder={field.placeholder}
        disabled={field.validation?.readonly}
        className={cn(
          field.style?.inputColor && `text-${field.style.inputColor}`,
          field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
          field.style?.borderColor && `border-${field.style.borderColor}`,
          field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
          field.style?.padding && `p-${field.style.padding}`,
          field.style?.fontSize && `text-${field.style.fontSize}`,
          error && 'border-red-500',
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
    </BaseInput>
  )
} 