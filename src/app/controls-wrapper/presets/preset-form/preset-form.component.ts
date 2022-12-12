import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AppPreset } from '../../../shared/app-types';
import { FormService, getFormControl } from '../../../shared/form-service';
import { CustomInput } from '../../../shared/text-input/text-input.component';
import { PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-form',
  templateUrl: './preset-form.component.html',
  styleUrls: ['./preset-form.component.scss']
})
export class PresetFormComponent implements OnInit {
  @Input() preset?: AppPreset;
  newPresetForm!: FormGroup;
  @Output() closeForm = new EventEmitter();
  inputs: CustomInput[] = [
    {
      label: 'Name',
      description: 'Preset name.',
      inputs: [
        {
          type: 'text',
          getFormControl: () => getFormControl(this.newPresetForm, 'name'),
          placeholder: 'Name',
          widthPx: 200,
        },
      ],
    },
    {
      label: 'ID',
      description: 'Preset ID number.',
      inputs: [
        {
          type: 'number',
          getFormControl: () => getFormControl(this.newPresetForm, 'id'),
          placeholder: 'ID',
          widthPx: 70,
        },
      ],
    },
    {
      label: 'Label',
      description: 'Quick load label.',
      inputs: [
        {
          type: 'text',
          getFormControl: () => getFormControl(this.newPresetForm, 'quickLoadLabel'),
          placeholder: 'Label',
          widthPx: 100,
        },
      ],
    },
  ];
  textareaInput: CustomInput = {
    label: 'API Command', // TODO better label
    description: 'Manually set the API parameters.',
    inputs: [
      {
        type: 'textarea',
        getFormControl: () => getFormControl(this.newPresetForm, 'apiValue'),
        placeholder: '{}', // TODO better placeholder
        widthPx: 200,
        heightPx: 100,
      },
    ],
  };

  constructor(
    private formSerivce: FormService,
    private presetsService: PresetsService,
  ) { }

  ngOnInit() {
    this.newPresetForm = this.createForm(this.preset);
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
    } = this.newPresetForm.value
    let preset: Partial<AppPreset> = {};

    if (useCurrentState) {
      try {
        // TODO need to figure out better how this works
        preset = JSON.parse(apiValue);
      } catch (e) {
        preset.apiValue = apiValue;
        // TODO display error message
      }
    } else {
      const preset: AppPreset = {
        id,
        name,
        quickLoadLabel,
        apiValue,
        isExpanded: false,
      };
      this.presetsService.updatePreset(
        preset,
        useCurrentState,
        includeBrightness,
        saveSegmentBounds);
    }

    this.emitCloseForm()
  }

  emitCloseForm() {
    this.closeForm.emit();
  }

  private createForm(existingPreset?: AppPreset) {
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

    const form = this.formSerivce.createFormGroup({
      id,
      name,
      quickLoadLabel,
      useCurrentState: true,
    }, {
      includeBrightness: this.formSerivce.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      saveSegmentBounds: this.formSerivce.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      apiValue: this.formSerivce.formBuilder.control(apiValue, this.requiredIfUseCurrentStateEquals(false)),
    })

    return form;
  }

  private requiredIfUseCurrentStateEquals(expectedValue: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.newPresetForm) {
        return null
      }

      const useCurrentStateControl = this.newPresetForm.get('useCurrentState')
      const isRequired = useCurrentStateControl &&
        useCurrentStateControl.value === expectedValue;
      return isRequired
        ? Validators.required(control)
        : null;
    };
  }
}
