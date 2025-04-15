'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { BaseInput } from './BaseInput'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface AddressInputProps {
  field: FormField
}

export const AddressInput: React.FC<AddressInputProps> = ({ field }) => {
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
        <div className="space-y-2">
          <Input
            id={`${field.id}-street`}
            placeholder="Rua"
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
          <div className="grid grid-cols-2 gap-2">
            <Input
              id={`${field.id}-number`}
              placeholder="Número"
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
            <Input
              id={`${field.id}-complement`}
              placeholder="Complemento"
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
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              id={`${field.id}-neighborhood`}
              placeholder="Bairro"
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
            <Input
              id={`${field.id}-city`}
              placeholder="Cidade"
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
            <Input
              id={`${field.id}-state`}
              placeholder="Estado"
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
          </div>
          <Input
            id={`${field.id}-zipcode`}
            placeholder="CEP"
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
        </div>
      </BaseInput>
    )
  }

  const {
    register,
    formState: { errors },
  } = formContext

  const validationRules = {
    required: field.validation?.required ? `${field.label || 'Campo'} é obrigatório` : false,
  }

  const addressFields = [
    { id: 'street', name: 'street', placeholder: 'Rua' },
    { id: 'number', name: 'number', placeholder: 'Número' },
    { id: 'complement', name: 'complement', placeholder: 'Complemento' },
    { id: 'neighborhood', name: 'neighborhood', placeholder: 'Bairro' },
    { id: 'city', name: 'city', placeholder: 'Cidade' },
    { id: 'state', name: 'state', placeholder: 'Estado' },
    { id: 'zipcode', name: 'zipcode', placeholder: 'CEP' },
  ]

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
      <div className="space-y-2">
        <Input
          id={`${field.id}-street`}
          {...register(`${field.name}.street`, validationRules)}
          placeholder="Rua"
          disabled={field.validation?.readonly}
          className={cn(
            field.style?.inputColor && `text-${field.style.inputColor}`,
            field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
            field.style?.borderColor && `border-${field.style.borderColor}`,
            field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
            field.style?.padding && `p-${field.style.padding}`,
            field.style?.fontSize && `text-${field.style.fontSize}`,
            errors[`${field.name}.street`] && 'border-red-500',
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            id={`${field.id}-number`}
            {...register(`${field.name}.number`, validationRules)}
            placeholder="Número"
            disabled={field.validation?.readonly}
            className={cn(
              field.style?.inputColor && `text-${field.style.inputColor}`,
              field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
              field.style?.borderColor && `border-${field.style.borderColor}`,
              field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
              field.style?.padding && `p-${field.style.padding}`,
              field.style?.fontSize && `text-${field.style.fontSize}`,
              errors[`${field.name}.number`] && 'border-red-500',
            )}
          />
          <Input
            id={`${field.id}-complement`}
            {...register(`${field.name}.complement`)}
            placeholder="Complemento"
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
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            id={`${field.id}-neighborhood`}
            {...register(`${field.name}.neighborhood`, validationRules)}
            placeholder="Bairro"
            disabled={field.validation?.readonly}
            className={cn(
              field.style?.inputColor && `text-${field.style.inputColor}`,
              field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
              field.style?.borderColor && `border-${field.style.borderColor}`,
              field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
              field.style?.padding && `p-${field.style.padding}`,
              field.style?.fontSize && `text-${field.style.fontSize}`,
              errors[`${field.name}.neighborhood`] && 'border-red-500',
            )}
          />
          <Input
            id={`${field.id}-city`}
            {...register(`${field.name}.city`, validationRules)}
            placeholder="Cidade"
            disabled={field.validation?.readonly}
            className={cn(
              field.style?.inputColor && `text-${field.style.inputColor}`,
              field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
              field.style?.borderColor && `border-${field.style.borderColor}`,
              field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
              field.style?.padding && `p-${field.style.padding}`,
              field.style?.fontSize && `text-${field.style.fontSize}`,
              errors[`${field.name}.city`] && 'border-red-500',
            )}
          />
          <Input
            id={`${field.id}-state`}
            {...register(`${field.name}.state`, validationRules)}
            placeholder="Estado"
            disabled={field.validation?.readonly}
            className={cn(
              field.style?.inputColor && `text-${field.style.inputColor}`,
              field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
              field.style?.borderColor && `border-${field.style.borderColor}`,
              field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
              field.style?.padding && `p-${field.style.padding}`,
              field.style?.fontSize && `text-${field.style.fontSize}`,
              errors[`${field.name}.state`] && 'border-red-500',
            )}
          />
        </div>
        <Input
          id={`${field.id}-zipcode`}
          {...register(`${field.name}.zipcode`, validationRules)}
          placeholder="CEP"
          disabled={field.validation?.readonly}
          className={cn(
            field.style?.inputColor && `text-${field.style.inputColor}`,
            field.style?.backgroundColor && `bg-${field.style.backgroundColor}`,
            field.style?.borderColor && `border-${field.style.borderColor}`,
            field.style?.borderRadius && `rounded-${field.style.borderRadius}`,
            field.style?.padding && `p-${field.style.padding}`,
            field.style?.fontSize && `text-${field.style.fontSize}`,
            errors[`${field.name}.zipcode`] && 'border-red-500',
          )}
        />
      </div>
      {Object.entries(errors).map(([key, error]) => {
        if (key.startsWith(field.name)) {
          return (
            <p key={key} className="text-sm text-red-500 mt-1">
              {error.message as string}
            </p>
          )
        }
        return null
      })}
    </BaseInput>
  )
}
