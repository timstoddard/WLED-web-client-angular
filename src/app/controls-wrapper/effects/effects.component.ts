import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { FormService, FormValues } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { EffectMetadata, EffectsService } from './effects.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';
import { EffectsControlsComponent } from './effects-controls/effects-controls.component';
import { CustomIndex, OptionIndex } from 'src/app/shared/app-types/app-state';

const NO_EFFECT_SELECTED = -1;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
})
export class EffectsComponent extends UnsubscriberComponent implements OnInit {
  @ViewChild(EffectsControlsComponent) effectsControlsComponent!: EffectsControlsComponent;
  effectsForm!: FormGroup;

  constructor(
    private effectsService: EffectsService,
    private formService: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.effectsForm = this.createForm();

    this.handleUnsubscribe(this.effectsService.getSelectedEffectMetadata$())
      .subscribe((metadata: EffectMetadata) => {
        this.effectsForm.patchValue(metadata, { emitEvent: false });
      });
  }

  ngAfterViewInit() {
    this.handleUnsubscribe(this.effectsService.getSelectedEffect$())
      .pipe(distinctUntilChanged())
      .subscribe(({ id }) => {
        this.effectsForm.get('selectedEffect')!
          .patchValue(id, { emitEvent: false });
        this.effectsControlsComponent.updateOptionsAndSliders(id);
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

  getMatIconForDimension(dimension: EffectDimension) {
    switch (dimension) {
      case EffectDimension.ZERO:
        return 'line_end_circle';
      case EffectDimension.ONE:
        return 'conversion_path';
      case EffectDimension.TWO:
        return 'apps';
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
        .subscribe(() => this.effectsControlsComponent.updateOptionsAndSliders(effectId));
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

    this.getValueChanges<number>(form, 'selectedEffect')
      .subscribe((effectId: number) => this.setEffect(effectId));

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
      selectedEffect: NO_EFFECT_SELECTED,
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
