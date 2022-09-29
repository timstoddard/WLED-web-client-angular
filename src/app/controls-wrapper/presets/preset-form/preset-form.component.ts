import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormService } from '../../../shared/form-service';
import { OnlineStatusService } from '../../../shared/online-status.service';
import { Preset, PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-form',
  templateUrl: './preset-form.component.html',
  styleUrls: ['./preset-form.component.scss']
})
export class PresetFormComponent implements OnInit {
  @Input() preset?: Preset;
  newPreset!: FormGroup;
  @Output() closeForm = new EventEmitter();

  constructor(
    private formSerivce: FormService,
    private presetsService: PresetsService,
    private onlineStatusService: OnlineStatusService,
  ) { }

  ngOnInit() {
    this.newPreset = this.createForm(this.preset);
  }

  savePreset() {
    // TODO get typed form values (new ng feature)
    const {
      id,
      name,
      quickLoadLabel,
      apiValue,
      useCurrentState,
      includeBrightness,
      saveSegmentBounds,
    } = this.newPreset.value
    let preset: Partial<Preset> = {};

    if (useCurrentState) {
      try {
        // TODO need to figure out better how this works
        preset = JSON.parse(apiValue);
      } catch (e) {
        preset.apiValue = apiValue;
        // TODO display error message
      }
    } else {
      const preset: Preset = {
        id,
        name,
        quickLoadLabel,
        apiValue,
      };
      if (!this.onlineStatusService.getIsOffline()) {
        this.presetsService.savePreset(
          preset,
          useCurrentState,
          includeBrightness,
          saveSegmentBounds);
      }
    }

    this.emitCloseForm()
  }

  emitCloseForm() {
    this.closeForm.emit();
  }

  private createForm(existingPreset?: Preset) {
    let id = this.presetsService.getNextPresetId()
    let name = ''
    let quickLoadLabel = ''
    let apiValue = ''

    if (existingPreset) {
      id = existingPreset.id
      name = existingPreset.name
      quickLoadLabel = existingPreset.quickLoadLabel
      apiValue = existingPreset.apiValue
    }

    // TODO use formSerivce.createFormGroup()
    const form = this.formSerivce.formBuilder.group({
      id: this.formSerivce.formBuilder.control(id, Validators.required),
      name: this.formSerivce.formBuilder.control(name, Validators.required),
      quickLoadLabel: this.formSerivce.formBuilder.control(quickLoadLabel),
      useCurrentState: this.formSerivce.formBuilder.control(true, Validators.required),
      includeBrightness: this.formSerivce.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      saveSegmentBounds: this.formSerivce.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      apiValue: this.formSerivce.formBuilder.control(apiValue, this.requiredIfUseCurrentStateEquals(false)),
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
