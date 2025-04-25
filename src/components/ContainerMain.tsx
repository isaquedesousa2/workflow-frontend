import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'

interface ContainerMainProps {
  title: string
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
}

export const ContainerMain = ({ children, header, className, title }: ContainerMainProps) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="z-10">{header}</div>
      <div className={cn('p-16 bg-white flex-1 overflow-auto', className)}>{children}</div>
    </div>
  )
}
