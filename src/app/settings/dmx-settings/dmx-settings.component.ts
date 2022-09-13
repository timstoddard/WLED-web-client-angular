import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues } from '../../shared/form-utils';

@Component({
  selector: 'app-dmx-settings',
  templateUrl: './dmx-settings.component.html',
  styleUrls: ['./dmx-settings.component.scss']
})
export class DmxSettingsComponent implements OnInit {
  dmxSettingsForm!: FormGroup;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.dmxSettingsForm = this.createForm();
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
