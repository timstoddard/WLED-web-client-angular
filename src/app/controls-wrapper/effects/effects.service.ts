import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames, findRouteData } from '../utils';

export interface Effect {
  id: number;
  name: string;
}

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService {
  sortedEffects!: Effect[];
  private selectedEffectName!: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {
    this.sortedEffects = this.sortEffects();
  }

  // TODO is this needed?
  // getEffects() {
  //   return this.apiService.getEffects();
  // }

  setEffect(effectId: number) {
    this.selectedEffectName = this.getEffectName(effectId);
    return this.apiService.setEffect(effectId);
  }

  setSpeed(effectId: number) {
    return this.apiService.setSpeed(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.setIntensity(effectId);
  }

  getEffectName(effectId: number) {
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
    const effectNames = (findRouteData('data', this.route) as WledApiResponse).effects;

    const sortedEffects = effectNames.slice(1) // remove 'Solid'
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
