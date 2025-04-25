import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'

interface ContainerMainProps {
  title: string
  subHeader?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ContainerMain = ({ children, subHeader, className, title }: ContainerMainProps) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="z-10">
        <Header title={title} />
        {subHeader}
      </div>
      <div className={cn('p-16 bg-white flex-1 overflow-auto', className)}>{children}</div>
    </div>
  )
}
