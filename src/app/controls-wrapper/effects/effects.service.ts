import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';

export interface EffectMetadata {
  speed: number;
  intensity: number;
}

export interface EffectFilters {
  showPalettesEffects: boolean;
  showVolumeEffects: boolean;
  showFrequencyEffects: boolean;
  show0DEffects: boolean;
  show1DEffects: boolean;
  show2DEffects: boolean;
}

export const DEFAULT_EFFECT_FILTERS: EffectFilters = {
  showPalettesEffects: false,
  showVolumeEffects: false,
  showFrequencyEffects: false,
  show0DEffects: false,
  show1DEffects: false,
  show2DEffects: false,
};

const NONE_SELECTED = -1;

@Injectable()
export class EffectsService extends UnsubscriberService {
  private effects!: AppEffect[];
  private filteredEffects$: BehaviorSubject<AppEffect[]>;
  private selectedEffect$: BehaviorSubject<AppEffect>;
  private selectedEffectMetadata$: BehaviorSubject<EffectMetadata>;
  private filterTextLowercase!: string;
  private currentEffectFilters!: EffectFilters;

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();

    this.filteredEffects$ = new BehaviorSubject<AppEffect[]>([]);
    this.selectedEffect$ = new BehaviorSubject<AppEffect>({
      id: NONE_SELECTED,
      name: this.getEffectName(NONE_SELECTED),
      usesPalette: false,
      usesVolume: false,
      usesFrequency: false,
      dimension: EffectDimension.ZERO,
    });
    this.selectedEffectMetadata$ = new BehaviorSubject({
      speed: 0,
      intensity: 0,
    });

    this.filterTextLowercase = '';
    this.currentEffectFilters = DEFAULT_EFFECT_FILTERS;

    this.appStateService.getEffects(this.ngUnsubscribe)
      .subscribe(effects => {
        // TODO use api mapper to sort in app state service
        this.effects = effects;
        this.triggerUIRefresh();
      });

    this.appStateService.getSelectedSegment(this.ngUnsubscribe)
      .subscribe(segment => {
        if (segment) {
          this.setEffect(segment.effectId, false);
          this.selectedEffectMetadata$.next({
            speed: segment.effectSpeed,
            intensity: segment.effectIntensity,
          });
        }
      });
  }

  setEffect(effectId: number, shouldCallApi = true) {
    const selectedEffect = this.getEffectById(effectId);
    if (selectedEffect) {
      this.selectedEffect$.next(selectedEffect);
    }

    return (shouldCallApi && effectId !== NONE_SELECTED)
      ? this.apiService.appState.effect.set(effectId)
      : null;
  }

  setSpeed(effectId: number) {
    return this.apiService.appState.speed.set(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.appState.intensity.set(effectId);
  }

  getSelectedEffect$() {
    return this.selectedEffect$;
  }

  getSelectedEffectMetadata$() {
    return this.selectedEffectMetadata$;
  }

  getFilteredEffects$() {
    return this.filteredEffects$;
  }

  /**
   * Returns a list of all effects whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * Also checks that effect meets the current effect filters.
   * @param filterText 
   * @param effectFilters
   * @returns 
   */
  filterEffects(
    filterText?: string,
    effectFilters?: EffectFilters,
  ) {
    if (filterText !== undefined) {
      this.filterTextLowercase = filterText.toLowerCase();
    }
    if (effectFilters) {
      this.currentEffectFilters = effectFilters;
    }

    const filteredEffects = this.effects
      .filter((effect) => {
        const nameMatches = effect.name.toLowerCase().includes(this.filterTextLowercase);
        const meetFilterCondition = this.getEffectFilterCondition(effect);
        return nameMatches && meetFilterCondition;
      });
    this.filteredEffects$.next(filteredEffects);
  }

  private getEffectById(effectId: number) {
    const effect = this.effects
      .find(((effect) => effect.id === effectId));
    return effect;
  }

  private getEffectName(effectId: number) {
    let effectName = '';
    if (effectId !== NONE_SELECTED) {
      const selectedEffect = this.getEffectById(effectId);
      if (selectedEffect) {
        effectName = selectedEffect.name;
      }
    }
    return effectName;
  }

  /** Triggers a UI refresh. */
  private triggerUIRefresh() {
    this.filterEffects(this.filterTextLowercase);
  }

  private getEffectFilterCondition(effect: AppEffect) {
    const effectFilterValues = [
      {
        conditionallyShow: this.currentEffectFilters.showPalettesEffects,
        conditionValue: effect.usesPalette,
      },
      {
        conditionallyShow: this.currentEffectFilters.showVolumeEffects,
        conditionValue: effect.usesVolume,
      },
      {
        conditionallyShow: this.currentEffectFilters.showFrequencyEffects,
        conditionValue: effect.usesFrequency,
      },
      {
        conditionallyShow: this.currentEffectFilters.show0DEffects,
        conditionValue: effect.dimension === EffectDimension.ZERO,
      },
      {
        conditionallyShow: this.currentEffectFilters.show1DEffects,
        conditionValue: effect.dimension === EffectDimension.ONE,
      },
      {
        conditionallyShow: this.currentEffectFilters.show2DEffects,
        conditionValue: effect.dimension === EffectDimension.TWO,
      },
    ];

    let filterCondition = true;
    for (const { conditionallyShow, conditionValue } of effectFilterValues) {
      if (conditionallyShow) {
        filterCondition = filterCondition && conditionValue;
      }
    }
    return filterCondition;
  }
}
