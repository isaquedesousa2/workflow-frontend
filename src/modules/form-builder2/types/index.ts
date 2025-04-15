export type FormComponentType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'button'
  | 'heading'

export type ColumnSpan = 1 | 2 | 3 | 4

export interface FormComponent {
  id: string
  type: FormComponentType
  label?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  options?: string[]
  columnSpan: ColumnSpan
}

export interface FormRow {
  id: string
  columns: number
  components: FormComponent[]
}

export interface DropIndicator {
  isVisible: boolean
  rowIndex: number
  componentIndex: number
  position: 'before' | 'after'
}
