'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ReactNode } from 'react'

interface ProcessCategoryProps {
  title: string
  icon: ReactNode
  bgColor: string
  textColor: string
  value: string
  children: ReactNode
}

export function ProcessCategory({
  title,
  icon,
  bgColor,
  textColor,
  value,
  children,
}: ProcessCategoryProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className={`${bgColor} ${textColor} p-2 rounded-lg`}>{icon}</div>
          <span className="font-medium text-lg">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  )
}
