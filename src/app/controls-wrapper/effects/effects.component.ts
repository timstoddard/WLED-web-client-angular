import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../shared/form-service';
import { PostResponseHandler } from '../../shared/post-response-handler';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { EffectsService } from './effects.service';

const NO_EFFECT_SELECTED = -1;
// TODO get these from api response
const DEFAULT_EFFECT_SPEED = 128;
const DEFAULT_EFFECT_INTENSITY = 128;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
  // need to provide here (child of routed component) so the service can access the activated route
  providers: [EffectsService],
})
export class EffectsComponent extends UnsubscriberComponent implements OnInit {
  effectsForm!: FormGroup;
  private showLabels!: boolean;

  constructor(
    private effectsService: EffectsService,
    private formSerivce: FormService,
    private uiConfigService: UIConfigService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
  }

  ngOnInit() {
    this.setEffect(NO_EFFECT_SELECTED);
    this.effectsForm = this.createForm();

    this.handleUnsubscribe(this.effectsService.getSelectedEffect$())
      .subscribe(({ id }) => {
        this.effectsForm.get('selectedEffect')!
          .patchValue(id, { emitEvent: false });
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
    this.effectsService.filterEffects(filterText);
  }

  toggleLabels() {
    this.uiConfigService.setShowLabels(!this.showLabels);
  }

  private setEffect(effectId: number) {
    const result = this.effectsService.setEffect(effectId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(this.postResponseHandler.handleFullJsonResponse());
    }
  }

  private setSpeed(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setSpeed(effectId))
      .subscribe(this.postResponseHandler.handleStateResponse());
  }

  private setIntensity(effectId: number) {
    this.handleUnsubscribe(
      this.effectsService.setIntensity(effectId))
      .subscribe(this.postResponseHandler.handleStateResponse());
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
