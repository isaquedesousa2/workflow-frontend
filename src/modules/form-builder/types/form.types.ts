export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'zoom'
  | 'dataset'
  | 'table'
  | 'file'
  | 'hidden'

export interface FieldOption {
  label: string
  value: string
}

export interface FieldValidation {
  required?: boolean
  readonly?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  customMessage?: string
}

export interface FieldVisibility {
  condition?: string
  value?: any
}

export interface FieldStyle {
  width?: string
  cols?: number // Número de colunas que o campo ocupa (1-12)
  className?: string
  labelPosition?: 'top' | 'left' | 'right'
}

export interface FormField {
  id: string
  type: FieldType
  name: string
  label: string
  placeholder?: string
  defaultValue?: any
  options?: FieldOption[]
  validation?: FieldValidation
  visibility?: FieldVisibility
  style?: FieldStyle
  dataset?: {
    tablename: string
    displayfield: string
    valuefield: string
    filterfields?: string[]
  }
  zoom?: {
    dataset: string
    fields: string[]
    resultfields: string[]
    searchby?: string[]
  }
  table?: {
    columns: FormField[]
    minRows?: number
    maxRows?: number
  }
}

export interface FormRow {
  id: string
  fields: FormField[]
  cols: number // Número de colunas na linha (1-4)
}

export interface FormLayout {
  rows: FormRow[]
}

export interface FormMetadata {
  id: string
  name: string
  description?: string
  version: number
  createdAt: string
  updatedAt: string
  processId?: string
}
