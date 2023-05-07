import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface FormControlRequirementConfig {
  path: string[];
  errorName: string;
  description: string;
}

@Component({
  selector: 'app-form-control-requirements',
  templateUrl: './form-control-requirements.component.html',
  styleUrls: ['./form-control-requirements.component.scss']
})
export class FormControlRequirementsComponent {
  @Input() form!: FormGroup;
  @Input() requirements: FormControlRequirementConfig[] = [];

  getError(
    form: FormGroup,
    path: string[],
    errorName: string,
  ) {
    let control: AbstractControl = form;
    for (const subPath of path) {
      control = form.get(subPath)!;
    }
    return control.errors
      ? control.errors[errorName]
      : null;
  }
}
