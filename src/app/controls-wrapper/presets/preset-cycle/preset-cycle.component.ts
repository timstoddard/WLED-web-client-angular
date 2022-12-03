import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppPreset } from '../../../shared/app-types';
import { FormService } from '../../../shared/form-service';

@Component({
  selector: 'app-preset-cycle',
  templateUrl: './preset-cycle.component.html',
  styleUrls: ['./preset-cycle.component.scss']
})
export class PresetCycleComponent implements OnInit {
  @Input() presets: AppPreset[] = [];
  formGroup!: FormGroup;
  isOn: boolean = false;

  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.formGroup = this.createForm();
  }

  toggleIsOn() {
    this.isOn = !this.isOn;
  }

  private createForm() {
    return this.formService.createFormGroup({
      firstPreset: '',
      lastPreset: '',
      presetDuration: '',
      transitionDuration: '',
    });
  }
}
