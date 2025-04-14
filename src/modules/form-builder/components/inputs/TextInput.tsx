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
  const formContext = useFormContext()
  const InputComponent = field.type === 'textarea' ? Textarea : Input

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
        <InputComponent
          id={field.id}
          type={field.type === 'textarea' ? undefined : field.type}
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
    minLength:
      field.validation?.minLength !== undefined
        ? {
            value: field.validation.minLength,
            message: `${field.label || 'Campo'} deve ter no mínimo ${
              field.validation.minLength
            } caracteres`,
          }
        : undefined,
    maxLength:
      field.validation?.maxLength !== undefined
        ? {
            value: field.validation.maxLength,
            message: `${field.label || 'Campo'} deve ter no máximo ${
              field.validation.maxLength
            } caracteres`,
          }
        : undefined,
    pattern:
      field.type === 'email'
        ? {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          }
        : field.type === 'phone'
        ? {
            value: /^\(\d{2}\) \d{5}-\d{4}$/,
            message: 'Telefone inválido',
          }
        : field.validation?.pattern
        ? {
            value: new RegExp(field.validation.pattern),
            message: `${field.label || 'Campo'} inválido`,
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
        {...register(field.name, validationRules)}
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
