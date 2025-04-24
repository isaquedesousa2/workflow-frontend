declare module 'react-input-mask' {
  import { Component, InputHTMLAttributes } from 'react'

  export interface InputState {
    value: string
    selection: {
      start: number
      end: number
    }
  }

  export interface MaskOptions {
    mask: string
    maskChar?: string
    formatChars?: Record<string, string>
    placeholderChar?: string
    alwaysShowMask?: boolean
  }

  export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string
    maskChar?: string
    formatChars?: Record<string, string>
    placeholderChar?: string
    alwaysShowMask?: boolean
    beforeMaskedValueChange?: (
      newState: InputState,
      oldState: InputState,
      userInput: string,
      maskOptions: MaskOptions,
    ) => InputState
  }

  export default class InputMask extends Component<InputMaskProps> {}
}
