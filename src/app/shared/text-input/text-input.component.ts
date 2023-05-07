import { Component, Input, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface CustomInput {
  label: string;
  description: string;
  inputs: InputConfig[];
  prefix?: string;
  suffix?: string;
}

export interface InputConfig {
  /** Input type. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input */
  type: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'textarea';
  /** Function that returns the form control. */
  getFormControl: () => FormControl;
  /** Placeholder text. */
  placeholder: string;
  /** Input mode. Default `'text'`. https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode */
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  /** Regex pattern to check input value against. https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern */
  pattern?: string;
  /** Manually set the width. */
  widthPx?: number;
  /** Manually set the height. */
  heightPx?: number;
  /** Min numeric value. For number type inputs only. */
  min?: number;
  /** Max numeric value. For number type inputs only. */
  max?: number;
  /** Step value. For number type inputs only. */
  step?: number;
}

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {
  @Input() label: string = '';
  @Input() inputs: InputConfig[] = [];
  // TODO use this
  @Input() @Optional() description: string = '';
  @Input() @Optional() prefix: string = '';
  @Input() @Optional() suffix: string = '';

  getInputMode({ type, inputMode }: InputConfig) {
    return inputMode
      ? inputMode
      : this.getDefaultInputModeForInputType(type);
  }

  /**
   * Sets the width and height styles for an input based on its config.
   * @param input input config
   * @param force true if the width should be immutable, false otherwise
   * @returns dictionary of `ngStyle`-formatted css width/height properties
   */
  getNgStyle(input: InputConfig, force: boolean) {
    const {
      widthPx,
      heightPx,
    } = input;
    const styles: { [key: string]: number } = {};

    if (widthPx) {
      styles['width.px'] = widthPx;
      if (force) {
        styles['max-width.px'] = widthPx;
        styles['min-width.px'] = widthPx;
      }
    }

    if (heightPx) {
      styles['height.px'] = heightPx;
      if (force) {
        styles['max-height.px'] = heightPx;
        styles['min-height.px'] = heightPx;
      }
    }

    return styles;
  }

  private getDefaultInputModeForInputType(inputType: string) {
    switch(inputType) {
      case 'number':
        return 'numeric';
      case 'tel':
        return 'tel';
      case 'search':
        return 'search';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      case 'password':
      case 'text':
      case 'textarea':
        return 'text';
      case 'button':
      case 'checkbox':
      case 'color':
      case 'date':
      case 'datetime-local':
      case 'file':
      case 'hidden':
      case 'image':
      case 'month':
      case 'radio':
      case 'range':
      case 'reset':
      case 'submit':
      case 'time':
      case 'week':
        return 'none';
      default:
        return 'text';
    }
  }
}
