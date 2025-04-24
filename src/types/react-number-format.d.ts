declare module 'react-number-format' {
  import { Component, InputHTMLAttributes } from 'react'

  export interface NumberFormatValues {
    floatValue: number | undefined
    formattedValue: string
    value: string
  }

  export interface NumberFormatProps extends InputHTMLAttributes<HTMLInputElement> {
    value?: string | number
    defaultValue?: string | number
    format?: string
    mask?: string
    customInput?: React.ComponentType<InputHTMLAttributes<HTMLInputElement>>
    onValueChange?: (values: NumberFormatValues) => void
    thousandSeparator?: string | boolean
    decimalSeparator?: string
    decimalScale?: number
    fixedDecimalScale?: boolean
    prefix?: string
    suffix?: string
    allowNegative?: boolean
    allowLeadingZeros?: boolean
    isNumericString?: boolean
    displayType?: 'input' | 'text'
    type?: 'text' | 'tel' | 'password'
    renderText?: (formattedValue: string) => React.ReactNode
    getInputRef?: ((el: HTMLInputElement) => void) | React.Ref<any>
    allowEmptyFormatting?: boolean
  }

  export class NumericFormat extends Component<NumberFormatProps> {}
  export class PatternFormat extends Component<NumberFormatProps> {}
}
