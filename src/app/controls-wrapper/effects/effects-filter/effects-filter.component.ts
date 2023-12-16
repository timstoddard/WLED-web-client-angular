import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControlFn } from 'src/app/shared/form-service';
import { DEFAULT_EFFECT_FILTERS, EffectFilters, EffectsService } from '../effects.service';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-effects-filter',
  templateUrl: './effects-filter.component.html',
  styleUrls: ['./effects-filter.component.scss']
})
export class EffectsFilterComponent extends UnsubscriberComponent {
  effectsFilterForm!: FormGroup;
  getFormControl!: getFormControlFn;

  formConfig = [
    {
      name: 'showPalettesEffects',
      label: 'Palette Effects',
    },
    {
      name: 'showVolumeEffects',
      label: 'Volume Effects',
    },
    {
      name: 'showFrequencyEffects',
      label: 'Frequency Effects',
    },
    {
      name: 'show0DEffects',
      label: '0D Effects',
    },
    {
      name: 'show1DEffects',
      label: '1D Effects',
    },
    {
      name: 'show2DEffects',
      label: '2D Effects',
    },
  ];

  constructor(
    private formSerivce: FormService,
    private effectsService: EffectsService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsFilterForm = this.createForm();
    this.getFormControl = createGetFormControl(this.effectsFilterForm);

    this.getValueChanges(this.effectsFilterForm)
      .subscribe((effectFilters) => {
        this.effectsService.filterEffects('', effectFilters as EffectFilters);
      });
  }

  private createForm() {
    // TODO better type instead of unknown
    const form = this.formSerivce.createFormGroup(DEFAULT_EFFECT_FILTERS as unknown as FormValues);
    return form;
  }
}
