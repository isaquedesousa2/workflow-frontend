'use client'

import React from 'react'
import { FormField } from '../../types/form.types'
import { cn } from '@/lib/utils'

interface BaseInputProps {
  field: FormField
  className?: string
  children: React.ReactNode
}

export const BaseInput: React.FC<BaseInputProps> = ({ field, className, children }) => {
  return (
    <div
      className={cn(
        'space-y-2',
        field.style?.width === '100%' && 'w-full',
        field.style?.width === '50%' && 'w-1/2',
        field.style?.width === '25%' && 'w-1/4',
        className,
      )}
    >
      {children}
    </div>
  )
}
