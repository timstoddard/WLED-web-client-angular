import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues } from '../../shared/form-utils';

@Component({
  selector: 'app-user-mod-settings',
  templateUrl: './user-mod-settings.component.html',
  styleUrls: ['./user-mod-settings.component.scss']
})
export class UserModSettingsComponent implements OnInit {
  userModSettingsForm!: FormGroup;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.userModSettingsForm = this.createForm();
  }

  submitForm() {
    // TODO
  }

  private createForm() {
    return this.formService.createFormGroup(this.getDefaultFormValues());
  }

  private getDefaultFormValues(): FormValues {
    return {
      // TODO
    };
  }
}
