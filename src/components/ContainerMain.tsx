import { cn } from '@/lib/utils'

interface ContainerMainProps {
  header: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ContainerMain = ({ children, header, className }: ContainerMainProps) => {
  return (
    <div className="flex flex-col flex-1 bg-gray-100">
      {header}
      <div className={cn('p-8', className)}>{children}</div>
    </div>
  )
}
