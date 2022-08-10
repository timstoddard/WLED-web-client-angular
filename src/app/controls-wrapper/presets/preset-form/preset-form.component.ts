import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Preset, PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-form',
  templateUrl: './preset-form.component.html',
  styleUrls: ['./preset-form.component.scss']
})
export class PresetFormComponent implements OnInit {
  @Input() presets: Preset[] = [];
  newPreset!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private presetsService: PresetsService,
  ) { }

  ngOnInit() {
    this.newPreset = this.createForm();
  }

  createPreset() {
    // TODO pass form data to api
  }

  private createForm() {
    const form = this.formBuilder.group({
      id: this.formBuilder.control(this.presetsService.getNextPresetId(), Validators.required),
      name: this.formBuilder.control('', Validators.required),
      quickLoadLabel: this.formBuilder.control(''),
      useCurrentState: this.formBuilder.control(true, Validators.required),
      includeBrightness: this.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      saveSegmentBounds: this.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      apiCommand: this.formBuilder.control('', this.requiredIfUseCurrentStateEquals(false)),
    });

    return form;
  }

  private requiredIfUseCurrentStateEquals(expectedValue: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.newPreset) {
        return null
      }

      const useCurrentStateControl = this.newPreset.get('useCurrentState')
      const isRequired = useCurrentStateControl &&
        useCurrentStateControl.value === expectedValue;
      return isRequired
        ? Validators.required(control)
        : null;
    };
  }
}
