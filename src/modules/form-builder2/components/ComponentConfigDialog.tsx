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
import { PhoneInputSettings } from '@/modules/form-builder2/components/settings/PhoneInputSettings'
import { NumberInputSettings } from './settings/NumberInputSettings'
import { FormComponent, FormComponentType } from '../types'
import { useState } from 'react'

interface ComponentConfigDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  component: FormComponent | null
  onConfigSubmit: (component: FormComponent) => void
  onUpdateComponent: (component: FormComponent) => void
}

export function ComponentConfigDialog({
  isOpen,
  onOpenChange,
  component,
  onConfigSubmit,
  onUpdateComponent,
}: ComponentConfigDialogProps) {
  const [hasError, setHasError] = useState(false)

  const handleUpdate = (updates: Partial<FormComponent>) => {
    if (!component) return
    onUpdateComponent({ ...component, ...updates })
  }

  const handleSubmit = () => {
    if (!component || hasError) return
    onConfigSubmit(component)
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
          <TextInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'title' && (
          <TitleInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'subtitle' && (
          <SubtitleInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'checkbox-group' && (
          <CheckboxGroupInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'checkbox' && (
          <CheckboxInputSettings component={component} onUpdate={handleUpdate} />
        )}

        {component?.type === 'date-picker' && (
          <DatePickerInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={setHasError}
          />
        )}

        {component?.type === 'email' && (
          <EmailInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={setHasError}
          />
        )}

        {component?.type === 'phone' && (
          <PhoneInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={setHasError}
          />
        )}

        {component?.type === 'number' && (
          <NumberInputSettings
            component={component}
            onUpdate={handleUpdate}
            onErrorChange={setHasError}
          />
        )}

        <DialogFooter className="flex justify-end space-x-2">
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
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
