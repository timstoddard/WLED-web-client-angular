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
      label: 'Palette Effects &#x1F3A8;',
    },
    {
      name: 'showVolumeEffects',
      label: 'Volume Effects &#9834;',
    },
    {
      name: 'showFrequencyEffects',
      label: 'Frequency Effects &#9835;',
    },
    {
      name: 'show0DEffects',
      label: '0D Effects &#8226;',
    },
    {
      name: 'show1DEffects',
      label: '1D Effects &#8942;',
    },
    {
      name: 'show2DEffects',
      label: '2D Effects &#9638;',
    },
  ];

  constructor(
    private formService: FormService,
    private effectsService: EffectsService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsFilterForm = this.createForm();
    this.getFormControl = createGetFormControl(this.effectsFilterForm);

    this.getValueChanges(this.effectsFilterForm)
      .subscribe((effectFilters) => {
        this.effectsService.filterEffectsByFilters(effectFilters as EffectFilters);
      });
  }

  unselectAllFilters() {
    const effectFilters = this.effectsFilterForm.value as EffectFilters;
    for (const filterName in effectFilters) {
      effectFilters[filterName as keyof EffectFilters] = false;
    }
    this.effectsFilterForm.patchValue(effectFilters);
  }

  private createForm() {
    const form = this.formService.createFormGroup(DEFAULT_EFFECT_FILTERS as {} as FormValues);
    return form;
  }
}
