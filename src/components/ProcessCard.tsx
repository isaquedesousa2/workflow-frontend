'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface ProcessCardProps {
  title: string
  icon: ReactNode
  count: number
  label: string
  bgColor: string
  textColor: string
}

export function ProcessCard({ title, icon, count, label, bgColor, textColor }: ProcessCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{title}</h3>
          <div className={`${bgColor} ${textColor} p-2 rounded-lg`}>{icon}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{count}</span>
          <Badge variant="secondary" className="text-xs">
            {label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
