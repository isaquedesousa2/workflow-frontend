import { cn } from '@/lib/utils'

interface ContainerMainProps {
  header: React.ReactNode
  subHeader?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ContainerMain = ({ children, header, subHeader, className }: ContainerMainProps) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="z-10">
        {header}
        {subHeader}
      </div>
      <div className={cn('p-16 bg-white flex-1 overflow-auto', className)}>{children}</div>
    </div>
  )
}
