export type FormComponentType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'checkbox-group'
  | 'button'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'none'
export type ColumnSpan = 1 | 2 | 3 | 4

export interface FormOption {
  label: string
  value: string
}

export interface FormComponent {
  id: string
  type: FormComponentType
  label: string
  name: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  options?: FormOption[]
  columnSpan: ColumnSpan
  description?: string
  multiple?: boolean
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    readonly?: boolean
  }
}

export interface FormRow {
  id: string
  columns: number
  components: (FormComponent | null)[]
}

export interface DropIndicator {
  isVisible: boolean
  rowIndex: number
  componentIndex: number
  position: 'before' | 'after'
}
