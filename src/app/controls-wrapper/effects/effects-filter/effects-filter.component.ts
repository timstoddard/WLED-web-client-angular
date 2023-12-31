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
      label: 'Palette Effects', // &#x1F3A8;
      matIconName: 'palette',
    },
    {
      name: 'showVolumeEffects',
      label: 'Volume Effects', // &#9834;
      matIconName: 'music_note',
    },
    {
      name: 'showFrequencyEffects',
      label: 'Frequency Effects', // &#9835;
      matIconName: 'graphic_eq',
    },
    {
      name: 'show0DEffects',
      label: '0-D Effects', // &#8226;
      // matIconName: 'line_end_circle',
    },
    {
      name: 'show1DEffects',
      label: '1-D Effects', // &#8942;
      // matIconName: 'conversion_path',
    },
    {
      name: 'show2DEffects',
      label: '2-D Effects', // &#9638;
      // matIconName: 'apps',
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
