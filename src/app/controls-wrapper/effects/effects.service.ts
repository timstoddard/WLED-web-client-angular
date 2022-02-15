import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingService } from '../../shared/unsubscribing.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames } from '../utils';

export interface Effect {
  id: number;
  name: string;
}

const NONE_SELECTED = -1;

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService extends UnsubscribingService {
  sortedEffects!: Effect[];
  private selectedEffectName!: string;
  private effectNames: string[] = [];

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();
    this.appStateService.getEffects(this.ngUnsubscribe)
      .subscribe(effects => {
        this.effectNames = effects;
        this.sortedEffects = this.sortEffects();
      });
  }

  setEffect(effectId: number) {
    this.selectedEffectName = this.getEffectName(effectId);
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

  getEffectName(effectId: number) {
    if (effectId === NONE_SELECTED) {
      return 'none';
    }
    if (this.sortedEffects && this.sortedEffects.length > 0) {
      const selectedPalette = this.sortedEffects
        .find(((n) => n.id === effectId));
      if (selectedPalette) {
        return selectedPalette.name;
      }
    }
    return '';
  }

  getSelectedEffectName() {
    return this.selectedEffectName;
  }

  /**
   * Returns a list of all effects whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * @param filterText 
   * @returns 
   */
  getFilteredEffects(filterText = '') {
    const filterTextLowercase = filterText.toLowerCase();
    const filteredEffects = this.sortedEffects
      .filter((effect) => effect.name.toLowerCase().includes(filterTextLowercase));
    return filteredEffects;
  }

  private sortEffects() {
    const sortedEffects = this.effectNames.slice(1) // remove 'Solid'
      .map((name, i) => ({
        id: i + 1,
        name,
      }));
    sortedEffects.sort(compareNames);
    sortedEffects.unshift({
      id: 0,
      name: 'Solid',
    });
    return sortedEffects;
  }
}
