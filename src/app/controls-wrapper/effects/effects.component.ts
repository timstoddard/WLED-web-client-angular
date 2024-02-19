import { Component, OnInit } from '@angular/core';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { EffectsService } from './effects.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';
import { EffectsSettingsComponent } from './effects-settings/effects-settings.component';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues } from 'src/app/shared/form-service';

const NO_EFFECT_SELECTED = -1;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
})
export class EffectsComponent extends UnsubscriberComponent implements OnInit {
  effectsForm!: FormGroup;
  EffectsSettingsComponent = EffectsSettingsComponent;

  constructor(
    private effectsService: EffectsService,
    private formService: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsForm = this.createForm();

    this.handleUnsubscribe(this.effectsService.getSelectedEffect$())
      .subscribe(({ id }) => {
        this.effectsForm.get('selectedEffect')!
          .patchValue(id, { emitEvent: false });
      });
  }

  getSelectedEffect() {
    return this.effectsService.getSelectedEffect$();
  }

  getFilteredEffects() {
    return this.effectsService.getFilteredEffects$();
  }

  filterList(filterText: string) {
    this.effectsService.filterEffectsByText(filterText);
  }

  getEffectFilters() {
    return this.effectsService.getEffectFilters();
  }

  isDimensionSelected(dimension: EffectDimension) {
    const effectFilters = this.getEffectFilters();
    switch (dimension) {
      case EffectDimension.ZERO:
        return effectFilters.show0DEffects;
      case EffectDimension.ONE:
        return effectFilters.show1DEffects;
      case EffectDimension.TWO:
        return effectFilters.show2DEffects;
      default:
        return false;
    }
  }

  getNumericDimension(dimension: EffectDimension) {
    switch (dimension) {
      case EffectDimension.ZERO:
        return 0;
      case EffectDimension.ONE:
        return 1;
      case EffectDimension.TWO:
        return 2;
      default:
        return '';
    }
  }

  // getMatIconForDimension(dimension: EffectDimension) {
  //   switch (dimension) {
  //     case EffectDimension.ZERO:
  //       return 'line_end_circle';
  //     case EffectDimension.ONE:
  //       return 'conversion_path';
  //     case EffectDimension.TWO:
  //       return 'apps';
  //     default:
  //       return '';
  //   }
  // }

  getHtmlFormattedEffectName(effect: AppEffect) {
    return this.effectsService.getHtmlFormattedEffectName(effect);
  }

  private setEffect(effectId: number) {
    const result = this.effectsService.setEffect(effectId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe();
    }
  }

  private createForm() {
    const form = this.formService.createFormGroup(this.getDefaultFormValues());

    this.getValueChanges<number>(form, 'selectedEffect')
      .subscribe((effectId: number) => this.setEffect(effectId));

    return form;
  }

  private getDefaultFormValues(): FormValues {
    return {
      selectedEffect: NO_EFFECT_SELECTED,
    };
  }
}
