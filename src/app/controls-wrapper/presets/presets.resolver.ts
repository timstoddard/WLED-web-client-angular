import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { from, of } from 'rxjs';
import { OnlineStatusService } from '../../shared/online-status.service';
import { ControlsServicesModule } from '../controls-services.module';
import { Preset, PresetsService } from './presets.service';

const offlinePresets = [
  {
    id: 1,
    name: 'Preset One',
    quickLoadLabel: 'P1',
    apiValue: '',
  },
  {
    id: 2,
    name: 'Number 2',
    quickLoadLabel: '#2',
    apiValue: '',
  },
  {
    id: 3,
    name: 'Thr33!!!',
    quickLoadLabel: '',
    apiValue: '',
  },
];

@Injectable({ providedIn: ControlsServicesModule })
export class PresetsResolver implements Resolve<Preset[]> {
  constructor(
    private presetsService: PresetsService,
    private onlineStatusService: OnlineStatusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    return this.onlineStatusService.getIsOffline()
      ? of(offlinePresets)
      : from(this.presetsService.getPresets())
  }
}
