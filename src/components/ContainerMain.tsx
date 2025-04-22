import { cn } from '@/lib/utils'

interface ContainerMainProps {
  header: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ContainerMain = ({ children, header, className }: ContainerMainProps) => {
  return (
    <div className="flex flex-col h-screen">
      {header}
      <div className={cn('p-16 bg-white flex-1 overflow-auto', className)}>{children}</div>
    </div>
  )
}
