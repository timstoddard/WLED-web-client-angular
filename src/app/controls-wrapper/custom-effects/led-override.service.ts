import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SegmentApiService } from '../../shared/api-service/segment-api.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { IndividualLedOverride } from '../../shared/api-types/post-requests';
import { CustomEffect } from './effect';
import { CustomEffects } from './effects';

export const CUSTOM_EFFECTS = [
  { name: 'Xmas', effect: CustomEffects.effect1 },
  { name: 'Fade', effect: CustomEffects.effect2 },
  { name: 'Sin', effect: CustomEffects.effect3 },
];

@Injectable({ providedIn: 'root' })
export class LedOverrideService extends UnsubscriberService {
  private iterations: number;
  private renderInterval!: number;
  private renderRateMs: number;
  private selectedEffect: CustomEffect | null;
  private leds$: BehaviorSubject<IndividualLedOverride[]>;

  constructor(
    private segmentApiService: SegmentApiService,
  ) {
    super();
    this.iterations = 0;
    this.renderRateMs = 200;
    this.selectedEffect = null;
    this.leds$ = new BehaviorSubject([] as IndividualLedOverride[]);
  }

  init = (selectedIndex: number) => {
    this.updateSelectedEffect(selectedIndex);
  }

  start = () => {
    if (this.renderInterval) {
      this.stop();
    }
    this.renderInterval = setInterval(this.render, this.renderRateMs) as unknown as number;
  }

  stop = () => {
    clearInterval(this.renderInterval);
  }

  reset = () => {
    this.stop();
    this.iterations = 0;
    this.render();
  }

  getLedOverrides = () => {
    return this.leds$;
  }

  updateRenderRateMs = (ms: number) => {
    this.renderRateMs = ms;
    this.start();
  }

  updateSelectedEffect = (effectIndex: number) => {
    const newEffect = CUSTOM_EFFECTS[effectIndex];
    if (newEffect) {
      this.selectedEffect = newEffect.effect;
      this.reset();
    } else {
      console.warn(`No effect at index ${effectIndex}.`);
    }
  }

  render = () => {
    if (this.selectedEffect) {
      console.log('demo')
      const ledOverrides = this.selectedEffect({
        length: 1000, // 256,
        iterations: this.iterations,
      });

      this.handleUnsubscribe(
        this.segmentApiService.setSegmentLedOverride(ledOverrides)
      ).subscribe();
      this.leds$.next(ledOverrides);
      // console.log(ledOverrides)
      this.iterations++;
    }
  }
}
