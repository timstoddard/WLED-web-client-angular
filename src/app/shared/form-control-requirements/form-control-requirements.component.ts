import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface FormControlRequirementConfig {
  path: string;
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
    path: string,
    errorName: string,
  ) {
    const control = form.get(path);
    return control?.errors
      ? control.errors[errorName]
      : null;
  }
}
