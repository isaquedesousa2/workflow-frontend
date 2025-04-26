import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/process-builder/features/form/types'
import { cn } from '@/lib/utils'

interface BaseInputProps<T extends FormComponent> {
  component: T
  children: React.ReactNode
  className?: string
}

export function BaseInput<T extends FormComponent>({
  component,
  children,
  className,
}: BaseInputProps<T>) {
  return (
    <div id={component.id} className={cn('flex flex-col gap-1', className)}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Label>{component.label}</Label>
          {component.required && <span className="text-red-500">*</span>}
        </div>
        {children}
      </div>
      {component.description && (
        <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
          {component.description}
        </p>
      )}
    </div>
  )
}
