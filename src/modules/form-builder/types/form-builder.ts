export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'email'
  | 'number'
  | 'phone'
  | 'address'
  | 'city'
  | 'state'
  | 'country'

export interface FieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  name: string
  label: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]
  defaultValue?: string | string[] | boolean
  description?: string
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

export interface FormColumn {
  id: string
  fields: FormField[]
}

export interface FormRow {
  id: string
  columns: FormColumn[]
}

export interface DraggableItem {
  id: string
  type: 'FIELD' | 'ROW' | 'COLUMN'
  data: any
}
