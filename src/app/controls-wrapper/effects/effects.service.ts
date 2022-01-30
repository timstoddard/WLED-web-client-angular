import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames } from '../utils';

export interface Effect {
  id: number;
  name: string;
}

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService {
  sortedEffects!: Effect[];

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
    return this.apiService.setEffect(effectId);
  }

  setSpeed(effectId: number) {
    return this.apiService.setSpeed(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.setIntensity(effectId);
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
    const effectNames = (this.route.snapshot.data['data'] as WledApiResponse).effects;

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
