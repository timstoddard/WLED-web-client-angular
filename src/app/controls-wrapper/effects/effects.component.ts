import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../shared/form-service';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { EffectsService } from './effects.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';

const NO_EFFECT_SELECTED = -1;
// TODO get these from api response
const DEFAULT_EFFECT_SPEED = 128;
const DEFAULT_EFFECT_INTENSITY = 128;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
})
export class EffectsComponent extends UnsubscriberComponent implements OnInit {
  effectsForm!: FormGroup;
  sliderLabels!: string[];
  private showLabels!: boolean;

  constructor(
    private effectsService: EffectsService,
    private formSerivce: FormService,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsForm = this.createForm();
    this.sliderLabels = [];

    this.handleUnsubscribe(this.effectsService.getSelectedEffect$())
      .subscribe(({ id }) => {
        this.effectsForm.get('selectedEffect')!
          .patchValue(id, { emitEvent: false });

        const selectedEffect = this.effectsService.getEffectById(id);
        if (selectedEffect) {
          this.sliderLabels = this.effectsService.getSelectedEffectSliderLabels(selectedEffect);
        }
      });

    this.handleUnsubscribe(this.effectsService.getSelectedEffectMetadata$())
      .subscribe(({ speed, intensity }) => {
        this.effectsForm.get('speed')!
          .patchValue(speed, { emitEvent: false });
        this.effectsForm.get('intensity')!
          .patchValue(intensity, { emitEvent: false });
      });

    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.showLabels = uiConfig.showLabels;
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

  toggleLabels() {
    this.uiConfigService.setShowLabels(!this.showLabels);
  }

  getEffectFilters() {
    return this.effectsService.getEffectFilters();
  }

  isEffectDimensionSelected(effect: AppEffect) {
    const effectFilters = this.getEffectFilters();
    switch (effect.dimension) {
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

  getNumericDimension(effect: AppEffect) {
    switch (effect.dimension) {
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

  getHtmlFormattedEffectName(effect: AppEffect) {
    return this.effectsService.getHtmlFormattedEffectName(effect);
  }

  private setEffect(effectId: number) {
    const result = this.effectsService.setEffect(effectId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe();

      const selectedEffect = this.effectsService.getEffectById(effectId);
      if (selectedEffect) {
        this.effectsService.getSelectedEffectSliderLabels(selectedEffect);
      }
    }
  }

  private setSpeed(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setSpeed(effectId))
      .subscribe();
  }

  private setIntensity(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setIntensity(effectId))
      .subscribe();
  }

  private createForm() {
    const form = this.formSerivce.createFormGroup({
      selectedEffect: NO_EFFECT_SELECTED,
      speed: DEFAULT_EFFECT_SPEED,
      intensity: DEFAULT_EFFECT_INTENSITY,
    });

    this.getValueChanges<number>(form, 'selectedEffect')
      .subscribe((effectId: number) => this.setEffect(effectId));

    this.getValueChanges<number>(form, 'speed')
      .subscribe((speed: number) => this.setSpeed(speed));

    this.getValueChanges<number>(form, 'intensity')
      .subscribe((intensity: number) => this.setIntensity(intensity));

    return form;
  }
}
