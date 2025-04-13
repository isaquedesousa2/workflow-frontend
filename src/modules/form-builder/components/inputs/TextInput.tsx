'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface TextInputProps {
  field: FormField
}

export const TextInput: React.FC<TextInputProps> = ({ field }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const InputComponent = field.type === 'textarea' ? Textarea : Input
  const error = errors[field.name]

  const validationRules = {
    required: field.validation?.required ? `${field.label || 'Campo'} é obrigatório` : false,
    pattern:
      field.type === 'email'
        ? {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
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

      <InputComponent
        id={field.id}
        {...register(field.name)}
        type={field.type === 'textarea' ? undefined : field.type}
        placeholder={field.placeholder}
        required={field.validation?.required}
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
