import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dmx-settings',
  templateUrl: './dmx-settings.component.html',
  styleUrls: ['./dmx-settings.component.scss']
})
export class DmxSettingsComponent implements OnInit {
  dmxSettingsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dmxSettingsForm = this.createForm();
  }

  submitForm() {
    // TODO
  }

  private createForm() {
    return this.formBuilder.group({
      //
    });
  }
}
