import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../shared/form-service';
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
