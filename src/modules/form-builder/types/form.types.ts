export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'file'
  | 'hidden'
  | 'dataset'
  | 'zoom'
  | 'table'
  | 'phone'
  | 'address'
  | 'city'
  | 'state'
  | 'country'

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
  label?: string
  placeholder?: string
  description?: string
  validation?: {
    required?: boolean
    readonly?: boolean
    min?: number
    max?: number
    step?: number
  }
  options?: Array<{
    label: string
    value: string
  }>
  style?: {
    width?: '25%' | '50%' | '75%' | '100%'
    cols?: number
    labelPosition?: 'top' | 'left' | 'right'
    labelColor?: string
    inputColor?: string
    backgroundColor?: string
    borderColor?: string
    borderRadius?: string
    padding?: string
    fontSize?: string
    helperTextColor?: string
  }
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
  cols?: number
  columns?: number
}

export interface FormLayout {
  rows: FormRow[]
  sections: any[]
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
