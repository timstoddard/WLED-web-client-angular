import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-preset-form',
  templateUrl: './preset-form.component.html',
  styleUrls: ['./preset-form.component.scss']
})
export class PresetFormComponent implements OnInit {
  newPreset!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.newPreset = this.createForm();
  }

  createPreset() {
    // TODO pass form data to api
  }

  private createForm() {
    const form = this.formBuilder.group({
      id: this.formBuilder.control(0, Validators.required), // TODO see lSeg logic in presets comp, to get default
      name: this.formBuilder.control('', Validators.required),
      quickLoadLabel: this.formBuilder.control(''), // optional
      useCurrentState: this.formBuilder.control(true),
      includeBrightness: this.formBuilder.control(true),
      saveSegmentBounds: this.formBuilder.control(true),
    });

    return form;
  }
}
