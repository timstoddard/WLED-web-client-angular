import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AppPreset } from '../../../shared/app-types/app-presets';
import { FormService, createGetFormControl, getFormControl, getFormControlFn } from '../../../shared/form-service';
import { CustomInput } from '../../../shared/text-input/text-input.component';
import { PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-form',
  templateUrl: './preset-form.component.html',
  styleUrls: ['./preset-form.component.scss']
})
export class PresetFormComponent implements OnInit {
  @Input() preset?: AppPreset;
  @Input() formType!: 'create' | 'update';
  presetForm!: FormGroup;
  @Output() closeForm = new EventEmitter();
  inputs1!: CustomInput[];
  inputs2!: CustomInput[];
  textAreaInput!: CustomInput;
  getFormControl!: getFormControlFn;

  constructor(
    private formService: FormService,
    private presetsService: PresetsService,
  ) { }

  ngOnInit() {
    this.presetForm = this.createForm(this.preset);
    this.getFormControl = createGetFormControl(this.presetForm);
    this.inputs1 = this.getInputs1();
    this.inputs2 = this.getInputs2();
    this.textAreaInput = this.gettextAreaInput();
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
    } = this.presetForm.value
    let preset: Partial<AppPreset> = {};

    if (useCurrentState) {
      try {
        // TODO need to figure out better how this works
        preset = JSON.parse(apiCommand);
      } catch (e) {
        preset.apiValue = apiCommand;
        // TODO display error message
      }
    } else {
      const preset: AppPreset = {
        id,
        name,
        quickLoadLabel,
        apiValue: apiCommand,
        isExpanded: false,
      };
      this.presetsService.updatePreset(
        preset,
        useCurrentState,
        includeBrightness,
        saveSegmentBounds,
      );
    }

    this.emitCloseForm()
  }

  emitCloseForm() {
    this.closeForm.emit();
  }

  private getInputs1(): CustomInput[] {
    return [
      {
        label: 'Name',
        description: '',
        inputs: [
          {
            type: 'text',
            getFormControl: () => getFormControl(this.presetForm, 'name'),
            placeholder: 'Name',
            widthPx: 250,
          },
        ],
      },
    ];
  }

  private getInputs2(): CustomInput[] {
    return [
      {
        label: 'ID',
        description: '',
        inputs: [
          {
            type: 'number',
            getFormControl: () => getFormControl(this.presetForm, 'id'),
            placeholder: 'ID',
            widthPx: 70,
          },
        ],
      },
      {
        label: 'Quick Load Label',
        description: 'Max 2 letters',
        inputs: [
          {
            type: 'text',
            getFormControl: () => getFormControl(this.presetForm, 'quickLoadLabel'),
            placeholder: 'Label',
            widthPx: 80,
          },
        ],
      },
    ];
  }

  private gettextAreaInput(): CustomInput {
    return {
      label: 'API Command',
      description: 'Accepts any valid HTTP or JSON API command',
      inputs: [
        {
          type: 'textarea',
          getFormControl: () => getFormControl(this.presetForm, 'apiCommand'),
          placeholder: '{}', // TODO better placeholder
          widthPx: 200,
          heightPx: 100,
        },
      ],
    };
  }

  private createForm(existingPreset?: AppPreset) {
    let id = this.presetsService.getNextPresetId();
    let name = '';
    let quickLoadLabel = '';
    let apiCommand = '';

    if (existingPreset) {
      id = existingPreset.id;
      name = existingPreset.name;
      quickLoadLabel = existingPreset.quickLoadLabel ?? '';
      apiCommand = existingPreset.apiValue;
    }

    const form = this.formService.createFormGroup({
      id,
      name,
      quickLoadLabel,
      useCurrentState: true,
    }, {
      includeBrightness: this.formService.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      saveSegmentBounds: this.formService.formBuilder.control(true, this.requiredIfUseCurrentStateEquals(true)),
      apiCommand: this.formService.formBuilder.control(apiCommand, this.requiredIfUseCurrentStateEquals(false)),
    });

    return form;
  }

  private requiredIfUseCurrentStateEquals(expectedValue: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.presetForm) {
        return null
      }

      const useCurrentStateControl = this.presetForm.get('useCurrentState')
      const isRequired = useCurrentStateControl &&
        useCurrentStateControl.value === expectedValue;
      return isRequired
        ? Validators.required(control)
        : null;
    };
  }
}
