import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { genericPostResponse } from '../utils';
import { Effect, EffectsService } from './effects.service';

const DEFAULT_EFFECT_ID = 0;
const DEFAULT_EFFECT_SPEED = 128;
const DEFAULT_EFFECT_INTENSITY = 128;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
  // need to provide here (child of routed component) so the service can access the activated route
  providers: [EffectsService],
})
export class EffectsComponent extends UnsubscribingComponent implements OnInit {
  effects!: Effect[];
  effectsForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private effectsService: EffectsService,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.effects = this.effectsService.getFilteredEffects();
    this.effectsForm = this.createForm();
  }

  getSelectedEffectName() {
    return this.effectsService.getSelectedEffectName();
  }

  filterList(filterText: string) {
    this.effects = this.effectsService.getFilteredEffects(filterText);
  }

  toggleLabels() {
    // config.comp.labels = !config.comp.labels;
    // this.applyCfg(config);
  }

  private setEffect(effectId: number) {
    this.effectsService.setEffect(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private setSpeed(effectId: number) {
    this.effectsService.setSpeed(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private setIntensity(effectId: number) {
    this.effectsService.setIntensity(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private createForm() {
    const form = this.formBuilder.group({
      selectedEffect: this.formBuilder.control(DEFAULT_EFFECT_ID),
      speed: this.formBuilder.control(DEFAULT_EFFECT_SPEED),
      intensity: this.formBuilder.control(DEFAULT_EFFECT_INTENSITY),
    });

    form.get('selectedEffect')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((effectId: number) => this.setEffect(effectId));

    form.get('speed')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((speed: number) => this.setSpeed(speed));

    form.get('intensity')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((intensity: number) => this.setIntensity(intensity));

    // trigger setting the name for the selected name
    setTimeout(() => {
      form.get('selectedEffect')!.setValue(DEFAULT_EFFECT_ID); 
    });

    return form;
  }
}
