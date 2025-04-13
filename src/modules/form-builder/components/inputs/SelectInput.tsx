'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface SelectInputProps {
  field: FormField
}

export const SelectInput: React.FC<SelectInputProps> = ({ field }) => {
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
      {field.label && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select {...register(field.name, validationRules)} disabled={field.validation?.readonly}>
        <SelectTrigger className={cn(error && 'border-red-500')}>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
    </BaseInput>
  )
}
