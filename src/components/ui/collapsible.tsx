'use client'

import * as React from 'react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  children: React.ReactNode
  className?: string
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  className?: string
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const CollapsibleContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

const Collapsible = ({ children, className = '' }: CollapsibleProps) => {
  const [open, setOpen] = useState(false)

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  )
}

const CollapsibleTrigger = ({ children, className = '' }: CollapsibleTriggerProps) => {
  const { open, setOpen } = React.useContext(CollapsibleContext)

  return (
    <button 
      type="button" 
      onClick={() => setOpen(!open)} 
      className={cn(className, 'w-full')}
    >
      <div className="flex items-center justify-between w-full">
        {children}
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            open && "transform rotate-180"
          )} 
        />
      </div>
    </button>
  )
}

const CollapsibleContent = ({ children, className = '' }: CollapsibleContentProps) => {
  const { open } = React.useContext(CollapsibleContext)

  return (
    <div
      className={cn(
        'grid transition-all duration-200 ease-in-out',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        'min-h-0',
        className
      )}
    >
      <div className="overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
