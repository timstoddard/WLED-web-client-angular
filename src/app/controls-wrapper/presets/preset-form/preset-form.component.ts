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

  savePreset() {
    // TODO get typed form values (new ng feature)
    const {
      id,
      name,
      quickLoadLabel,
      apiCommand,
      useCurrentState,
      includeBrightness,
      saveSegmentBounds,
    } = this.newPreset.value
    let preset: Partial<Preset> = {};
    if (useCurrentState) {
      try {
        // TODO need to figure out better how this works
        preset = JSON.parse(apiCommand);
      } catch (e) {
        preset.apiValue = apiCommand;
        // TODO display error message
      }
    } else {
      const preset: Preset = {
        id,
        name,
        quickLoadLabel,
        apiValue: apiCommand,
      };
      this.presetsService.savePreset(
        preset,
        useCurrentState,
        includeBrightness,
        saveSegmentBounds);
    }
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
