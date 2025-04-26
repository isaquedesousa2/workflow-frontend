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
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'datepicker'
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
  columnSpan: ColumnSpan
  placeholder?: string
  defaultValue?: string
  required?: boolean
  description?: string
  disabled?: boolean
  readOnly?: boolean
  lastUpdated?: Date | null
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

// Fields Types
export interface TextField extends FormComponent {
  type: 'text'
  minLength?: number
  maxLength?: number
}

export interface TextAreaField extends FormComponent {
  type: 'textarea'
  minLength?: number
  maxLength?: number
}

export interface SelectField extends FormComponent {
  type: 'select'
  options: FormOption[]
}

export interface NumberField extends FormComponent {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export interface ICheckboxField extends FormComponent {
  type: 'checkbox'
  isChecked?: boolean
}

export interface ICheckboxGroupField extends FormComponent {
  type: 'checkbox-group'
  options: FormOption[]
  multiple?: boolean
}

export interface EmailField extends FormComponent {
  type: 'email'
}

export interface PhoneField extends FormComponent {
  type: 'phone'
}

export interface ITextareaField extends FormComponent {
  type: 'textarea'
  rowsCount?: number
}

export interface IDatePickerField extends FormComponent {
  type: 'datepicker'
  placeholder?: string
  mode?: 'single' | 'range' | 'multiple'
  minDate?: string
  maxDate?: string
}

export interface ISelectField extends FormComponent {
  type: 'select'
  options: FormOption[]
}
