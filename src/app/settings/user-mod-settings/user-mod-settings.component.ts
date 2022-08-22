import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-mod-settings',
  templateUrl: './user-mod-settings.component.html',
  styleUrls: ['./user-mod-settings.component.scss']
})
export class UserModSettingsComponent implements OnInit {
  userModSettingsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userModSettingsForm = this.createForm();
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
