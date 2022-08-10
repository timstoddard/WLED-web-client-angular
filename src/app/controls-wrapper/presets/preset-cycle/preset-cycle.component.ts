import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Preset } from '../presets.service';

@Component({
  selector: 'app-preset-cycle',
  templateUrl: './preset-cycle.component.html',
  styleUrls: ['./preset-cycle.component.scss']
})
export class PresetCycleComponent implements OnInit {
  @Input() presets: Preset[] = [];
  formGroup!: FormGroup;
  isOn: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.createForm();
  }

  toggleIsOn() {
    this.isOn = !this.isOn;
  }

  private createForm() {
    return this.formBuilder.group({
      firstPreset: this.formBuilder.control('', Validators.required),
      lastPreset: this.formBuilder.control('', Validators.required),
      presetDuration: this.formBuilder.control('', Validators.required),
      transitionDuration: this.formBuilder.control('', Validators.required),
    });
  }
}
