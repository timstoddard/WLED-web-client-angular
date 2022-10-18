import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames } from '../utils';

export interface Effect {
  id: number;
  name: string;
}

const NONE_SELECTED = -1;

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService extends UnsubscriberService {
  private sortedEffects!: Effect[];
  private filteredEffects$: BehaviorSubject<Effect[]>;
  private selectedEffectName$: BehaviorSubject<string>;
  private effectNames: string[] = [];

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();

    this.filteredEffects$ = new BehaviorSubject<Effect[]>([]);
    this.selectedEffectName$ = new BehaviorSubject<string>(this.getEffectName(NONE_SELECTED));

    this.appStateService.getEffects(this.ngUnsubscribe)
      .subscribe(effects => {
        this.effectNames = effects;
        this.sortedEffects = this.sortEffects();
        this.filterEffects();
      });
  }

  setEffect(effectId: number) {
    const selectedEffectName = this.getEffectName(effectId);
    this.selectedEffectName$.next(selectedEffectName);
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

  getSelectedEffectName() {
    return this.selectedEffectName$;
  }

  getFilteredEffects() {
    return this.filteredEffects$;
  }

  /**
   * Returns a list of all effects whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * @param filterText 
   * @returns 
   */
  filterEffects(filterText = '') {
    const filterTextLowercase = filterText.toLowerCase();
    const filteredEffects = this.sortedEffects
      .filter((effect) => effect.name.toLowerCase().includes(filterTextLowercase));
    this.filteredEffects$.next(filteredEffects);
  }

  private sortEffects() {
    const createEffect = (id: number, name: string): Effect => ({
      id,
      name,
    });
    const sortedEffects = this.effectNames.slice(1) // remove 'Solid' before sorting
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
}
