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
  /** Input type. */
  type: 'text' | 'number' | 'textarea';
  /** Function that returns the form control. */
  getFormControl: () => FormControl;
  /** Placeholder text. */
  placeholder: string;
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
}
