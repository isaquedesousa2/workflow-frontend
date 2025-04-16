import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ColumnSpan, FormComponent, FormComponentType, FormRow } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createComponent(type: FormComponentType): FormComponent {
  const id = `${type}-${Math.random().toString(36).substring(2, 9)}`

  const baseComponent: FormComponent = {
    id,
    type,
    columnSpan: 1,
    label: '',
    name: Math.random().toString(36).substring(2, 9),
  }

  switch (type) {
    case 'text':
      return {
        ...baseComponent,
        label: 'Text Field',
        placeholder: 'Enter text...',
      }
    case 'textarea':
      return {
        ...baseComponent,
        label: 'Text Area',
        placeholder: 'Enter long text...',
      }
    case 'select':
      return {
        ...baseComponent,
        label: 'Select',
        placeholder: 'Select an option',
        options: ['Option 1', 'Option 2', 'Option 3'],
      }
    case 'checkbox':
      return {
        ...baseComponent,
        label: 'Checkbox',
        placeholder: 'Check this option',
      }
    case 'radio':
      return {
        ...baseComponent,
        label: 'Radio Group',
        options: ['Option 1', 'Option 2', 'Option 3'],
      }
    case 'button':
      return {
        ...baseComponent,
        label: 'Button',
      }
    case 'heading':
      return {
        ...baseComponent,
        label: 'Section Heading',
      }
    default:
      return baseComponent
  }
}

export function createRow(columns = 1): FormRow {
  return {
    id: `row-${Math.random().toString(36).substring(2, 9)}`,
    columns,
    components: [null, null, null, null],
  }
}

export function getColumnClass(span: ColumnSpan): string {
  switch (span) {
    case 1:
      return 'col-span-1'
    case 2:
      return 'col-span-2'
    case 3:
      return 'col-span-3'
    case 4:
      return 'col-span-4'
    default:
      return 'col-span-4'
  }
}

export function canAddComponentToRow(row: FormRow, componentSpan: ColumnSpan): boolean {
  const usedColumns = row.components.reduce(
    (total, component) => total + (component?.columnSpan ?? 0),
    0,
  )

  return usedColumns + componentSpan <= row.columns
}

export function getAvailableColumnsInRow(row: FormRow): number {
  const usedColumns = row.components.reduce(
    (total, component) => total + (component?.columnSpan ?? 0),
    0,
  )
  return row.columns - usedColumns
}

export function getAvailableIndices(row: FormRow): number[] {
  const availableColumns = getAvailableColumnsInRow(row)
  const indices: number[] = []

  for (let i = 0; i < row.components.length; i++) {
    if (row.components[i] === null && indices.length < availableColumns) {
      indices.push(i)
    }
  }

  return indices
}
