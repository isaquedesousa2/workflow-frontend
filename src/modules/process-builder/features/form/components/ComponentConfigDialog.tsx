import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TextInputSettings } from './settings/TextInputSettings'
import { TitleInputSettings } from './settings/TitleInputSettings'
import { SubtitleInputSettings } from './settings/SubtitleInputSettings'
import { CheckboxGroupInputSettings } from './settings/CheckboxGroupInputSettings'
import { CheckboxInputSettings } from './settings/CheckboxInputSettings'
import { DatePickerInputSettings } from './settings/DatePickerInputSettings'
import { EmailInputSettings } from './settings/EmailInputSettings'
import { PhoneInputSettings } from './settings/PhoneInputSettings'
import { NumberInputSettings } from './settings/NumberInputSettings'
import { FormComponent } from '../types'
import { useState } from 'react'
import { toast } from 'sonner'
import { TextareaInputSettings } from './settings/TextareaInputSettings'
import { SelectInputSettings } from '@/modules/process-builder/features/form/components/settings/SelectInputSettings'
interface ComponentConfigDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  component: any | undefined
  onConfigSubmit: (component: FormComponent) => void
  onUpdateComponent: (component: FormComponent | undefined) => void
}

export function ComponentConfigDialog({
  isOpen,
  onOpenChange,
  component,
  onConfigSubmit,
  onUpdateComponent,
}: ComponentConfigDialogProps) {
  const [hasError, setHasError] = useState(true)

  const handleUpdate = (updates: Partial<FormComponent>) => {
    if (!component) return
    onUpdateComponent({ ...component, ...updates })
  }

  const handleSubmit = () => {
    if (!component || hasError) return
    onConfigSubmit(component)

    toast.success('Campo atualizado com sucesso.')
  }

  const handleError = (hasError: boolean) => {
    console.log('hasError', hasError)
    setHasError(hasError)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Configurações do Campo
          </DialogTitle>
        </DialogHeader>

        {component?.type === 'text' && (
          <TextInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'title' && (
          <TitleInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'subtitle' && (
          <SubtitleInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'checkbox-group' && (
          <CheckboxGroupInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'checkbox' && (
          <CheckboxInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'textarea' && (
          <TextareaInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'date-picker' && (
          <DatePickerInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'email' && (
          <EmailInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'phone' && (
          <PhoneInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'number' && (
          <NumberInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={handleError}
          />
        )}

        {component?.type === 'datepicker' && (
          <DatePickerInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'select' && (
          <SelectInputSettings component={component} onUpdate={handleUpdate} />
        )}

        <DialogFooter className="flex justify-end space-x-2">
          {component?.lastUpdated && (
            <span className="text-sm text-gray-500">
              Última atualização: {component?.lastUpdated}
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={hasError}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
