import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppState } from '../../shared/app-types';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames } from '../utils';

export interface Effect {
  id: number;
  name: string;
}

export interface EffectMetadata {
  speed: number;
  intensity: number;
}

const NONE_SELECTED = -1;

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService extends UnsubscriberService {
  private sortedEffects!: Effect[];
  private filteredEffects$: BehaviorSubject<Effect[]>;
  private selectedEffect$: BehaviorSubject<Effect>;
  private selectedEffectMetadata$: BehaviorSubject<EffectMetadata>;
  private filterTextLowercase!: string;

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();

    this.filteredEffects$ = new BehaviorSubject<Effect[]>([]);
    this.selectedEffect$ = new BehaviorSubject({
      id: NONE_SELECTED,
      name: this.getEffectName(NONE_SELECTED),
    });
    this.selectedEffectMetadata$ = new BehaviorSubject({
      speed: 0,
      intensity: 0,
    });

    this.appStateService.getEffects(this.ngUnsubscribe)
      .subscribe(effects => {
        this.sortedEffects = this.sortEffects(effects);
        this.triggerUIRefresh();
      });

    this.appStateService.getState(this.ngUnsubscribe)
      .subscribe(({ mainSegmentId, segments }: AppState) => {
        const selectedSegment = segments[mainSegmentId];
        const currentEffect = selectedSegment.fx;
        this.setEffect(currentEffect as number);
        this.selectedEffectMetadata$.next({
          speed: selectedSegment.sx,
          intensity: selectedSegment.ix,
        });
      });
  }

  setEffect(effectId: number) {
    const selectedEffectName = this.getEffectName(effectId);
    this.selectedEffect$.next({
      id: effectId,
      name: selectedEffectName,
    });
    return effectId !== NONE_SELECTED
      ? this.apiService.setEffect(effectId)
      : null;
  }

  setSpeed(effectId: number) {
    return this.apiService.setSpeed(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.setIntensity(effectId);
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
   * @param filterText 
   * @returns 
   */
  filterEffects(filterText = '') {
    this.filterTextLowercase = filterText.toLowerCase();
    const filteredEffects = this.sortedEffects
      .filter((effect) => effect.name.toLowerCase().includes(this.filterTextLowercase));
    this.filteredEffects$.next(filteredEffects);
  }

  private sortEffects(effectNames: string[]) {
    const createEffect = (id: number, name: string): Effect => ({
      id,
      name,
    });
    const sortedEffects = effectNames.slice(1) // remove 'Solid' before sorting
      .map((name, i) => createEffect(i + 1, name));
    sortedEffects.sort(compareNames);
    sortedEffects.unshift(createEffect(0, 'Solid'));
    return sortedEffects;
  }

  private getEffectName(effectId: number) {
    let effectName = '';
    if (effectId !== NONE_SELECTED) {
      const selectedEffect = this.sortedEffects
        .find(((effect) => effect.id === effectId));
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
}
