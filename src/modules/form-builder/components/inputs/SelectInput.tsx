'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface SelectInputProps {
  field: FormField
}

export const SelectInput: React.FC<SelectInputProps> = ({ field }) => {
  const formContext = useFormContext()
  const InputComponent = field.type === 'select' ? Select : field.type === 'radio' ? RadioGroup : Checkbox

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
        {field.type === 'select' && (
          <Select disabled={field.validation?.readonly}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {field.type === 'radio' && (
          <RadioGroup disabled={field.validation?.readonly}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {field.type === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${option.value}`} disabled={field.validation?.readonly} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )}
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
      {field.type === 'select' && (
        <Select {...register(field.name, validationRules)} disabled={field.validation?.readonly}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {field.type === 'radio' && (
        <RadioGroup {...register(field.name, validationRules)} disabled={field.validation?.readonly}>
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
              <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {field.type === 'checkbox' && (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                {...register(field.name, validationRules)}
                id={`${field.id}-${option.value}`}
                value={option.value}
                disabled={field.validation?.readonly}
              />
              <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
    </BaseInput>
  )
}
