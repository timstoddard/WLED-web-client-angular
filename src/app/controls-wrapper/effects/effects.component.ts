import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { genericPostResponse } from '../utils';
import { EffectsService } from './effects.service';

const DEFAULT_EFFECT_ID = -1; // TODO get from first selected segment
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
  effectsForm!: FormGroup;
  private showLabels!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private effectsService: EffectsService,
    private appStateService: AppStateService,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    this.setEffect(DEFAULT_EFFECT_ID);
    this.effectsForm = this.createForm();

    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.showLabels = uiConfig.showLabels;
      });
  }

  getSelectedEffectName() {
    return this.effectsService.getSelectedEffectName();
  }

  getFilteredEffects() {
    return this.effectsService.getFilteredEffects();
  }

  filterList(filterText: string) {
    this.effectsService.filterEffects(filterText);
  }

  toggleLabels() {
    this.uiConfigService.setShowLabels(!this.showLabels);
  }

  private setEffect(effectId: number) {
    const result = this.effectsService.setEffect(effectId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(genericPostResponse(this.appStateService));
    }
  }

  private setSpeed(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setSpeed(effectId))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private setIntensity(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setIntensity(effectId))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private createForm() {
    const form = this.formBuilder.group({
      selectedEffect: this.formBuilder.control(DEFAULT_EFFECT_ID),
      speed: this.formBuilder.control(DEFAULT_EFFECT_SPEED),
      intensity: this.formBuilder.control(DEFAULT_EFFECT_INTENSITY),
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
