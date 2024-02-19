import { Component, OnInit } from '@angular/core';
import { EffectMetadata, EffectsService } from '../effects.service';
import { FormService, FormValues, createGetFormControl, getFormControlFn } from 'src/app/shared/form-service';
import { FormGroup } from '@angular/forms';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';
import { CustomIndex, OptionIndex } from 'src/app/shared/app-types/app-state';
import { EffectsCheckboxConfig, EffectsControlsService, EffectsSliderConfig } from './effects-controls.service';

@Component({
  selector: 'app-effects-controls',
  templateUrl: './effects-controls.component.html',
  styleUrls: ['./effects-controls.component.scss']
})
export class EffectsControlsComponent extends UnsubscriberComponent implements OnInit {
  effectsForm!: FormGroup;
  getFormControl!: getFormControlFn;
  sliderConfigs!: EffectsSliderConfig[];
  optionConfigs!: EffectsCheckboxConfig[];

  constructor(
    private effectsService: EffectsService,
    private formService: FormService,
    private effectsControlsService: EffectsControlsService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsForm = this.createForm();

    this.getFormControl = createGetFormControl(this.effectsForm);
    this.sliderConfigs = [];
    this.optionConfigs = [];

    this.handleUnsubscribe(this.effectsService.getSelectedEffect$())
      .subscribe(({ id }) => {
        this.updateOptionsAndSliders(id);
      });

    this.handleUnsubscribe(this.effectsService.getSelectedEffectMetadata$())
      .subscribe((metadata: EffectMetadata) => {
        this.effectsForm.patchValue(metadata, { emitEvent: false });
      });
  }

  private updateOptionsAndSliders(effectId: number) {
    const selectedEffect = this.effectsService.getEffectById(effectId);
    if (selectedEffect) {
      const {
        sliderConfigs,
        optionConfigs,
      } = this.effectsControlsService.getEffectControls(selectedEffect);

      this.sliderConfigs = sliderConfigs;
      this.optionConfigs = optionConfigs;
    }
  }

  private setSpeed(effectId: number) {
    this.handleUnsubscribe(this.effectsService.setSpeed(effectId))
      .subscribe();
  }

  private setIntensity(effectId: number) {
    this.handleUnsubscribe(this.effectsService.setIntensity(effectId))
      .subscribe();
  }

  private setCustom(index: CustomIndex, value: number) {
    this.handleUnsubscribe(this.effectsService.setCustom(index, value))
      .subscribe();
  }

  private setOption(index: OptionIndex, value: number) {
    this.handleUnsubscribe(this.effectsService.setOption(index, value))
      .subscribe();
  }

  private createForm() {
    const form = this.formService.createFormGroup(this.getDefaultFormValues());

    this.getValueChanges<number>(form, 'speed')
      .subscribe((speed: number) => this.setSpeed(speed));

    this.getValueChanges<number>(form, 'intensity')
      .subscribe((intensity: number) => this.setIntensity(intensity));

    this.getValueChanges<number>(form, 'custom1')
      .subscribe((custom1: number) => this.setCustom(1, custom1));

      this.getValueChanges<number>(form, 'custom2')
      .subscribe((custom2: number) => this.setCustom(2, custom2));

    this.getValueChanges<number>(form, 'custom3')
      .subscribe((custom3: number) => this.setCustom(3, custom3));

    this.getValueChanges<number>(form, 'option1')
      .subscribe((option1: number) => this.setOption(1, option1));

    this.getValueChanges<number>(form, 'option2')
      .subscribe((option2: number) => this.setOption(2, option2));

    this.getValueChanges<number>(form, 'option3')
      .subscribe((option3: number) => this.setOption(3, option3));

    return form;
  }

  private getDefaultFormValues(): FormValues {
    return {
      speed: 128,
      intensity: 128,
      custom1: 0,
      custom2: 0,
      custom3: 0,
      option1: 0,
      option2: 0,
      option3: 0,
    };
  }
}
