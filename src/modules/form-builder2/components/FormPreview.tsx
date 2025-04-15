'use client'

import type { FormRow } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getColumnClass } from '../utils'

interface FormPreviewProps {
  rows: FormRow[]
}

export function FormPreview({ rows }: FormPreviewProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center text-muted-foreground">Adicione linhas para ver o preview</div>
    )
  }

  return (
    <form className="space-y-3 text-sm" onSubmit={(e) => e.preventDefault()}>
      {rows.map((row, rowIndex) => (
        <div key={row.id} className={`grid grid-cols-${row.columns} gap-2`}>
          {row.components.map((component) => (
            <div key={component.id} className={`space-y-1 ${getColumnClass(component.columnSpan)}`}>
              {component.type === 'heading' ? (
                <h3 className="text-sm font-semibold">{component.label || 'Heading'}</h3>
              ) : component.label ? (
                <Label htmlFor={component.id} className="text-xs">
                  {component.label}
                </Label>
              ) : null}

              {component.type === 'text' && (
                <Input
                  id={component.id}
                  placeholder={component.placeholder || ''}
                  defaultValue={component.defaultValue || ''}
                  required={component.required}
                  className="h-7 text-xs"
                />
              )}

              {component.type === 'textarea' && (
                <Textarea
                  id={component.id}
                  placeholder={component.placeholder || ''}
                  defaultValue={component.defaultValue || ''}
                  required={component.required}
                  className="h-14 text-xs"
                />
              )}

              {component.type === 'select' && (
                <Select defaultValue={component.defaultValue}>
                  <SelectTrigger id={component.id} className="h-7 text-xs">
                    <SelectValue placeholder={component.placeholder || 'Select an option'} />
                  </SelectTrigger>
                  <SelectContent>
                    {(component.options || []).map((option, index) => (
                      <SelectItem key={index} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {component.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox id={component.id} required={component.required} className="h-3 w-3" />
                  <label
                    htmlFor={component.id}
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {component.placeholder || 'Checkbox'}
                  </label>
                </div>
              )}

              {component.type === 'radio' && (
                <RadioGroup defaultValue={component.defaultValue}>
                  {(component.options || ['Option 1', 'Option 2']).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${component.id}-${index}`}
                        className="h-3 w-3"
                      />
                      <Label htmlFor={`${component.id}-${index}`} className="text-xs">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {component.type === 'button' && (
                <Button type="button" className="h-7 text-xs">
                  {component.label || 'Button'}
                </Button>
              )}
            </div>
          ))}
        </div>
      ))}

      {rows.some((row) => row.components.some((c) => c.type !== 'button')) && (
        <Button type="submit" className="h-7 text-xs">
          Submit
        </Button>
      )}
    </form>
  )
}
