import { Injectable } from '@angular/core';
import { ApiTypeMapper } from '../../shared/api-type-mapper';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppFileSystemInfo, AppInfo, AppLedInfo } from '../../shared/app-types';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { formatPlural } from '../utils';

@Injectable()
export class InfoService extends UnsubscriberService {
  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private apiTypeMapper: ApiTypeMapper,
  ) {
    super();
  }

  refreshAppState() {
    this.apiService.refreshAppState();
  }

  fetchNodes() {
    this.handleUnsubscribe(this.apiService.getNodes())
      .subscribe(nodes => {
        const appNodes = this.apiTypeMapper.mapWLEDNodesToAppNodes(nodes);
        this.appStateService.setNodes(appNodes);
      });
  }

  // TODO add unit tests!
  getRuntimeString = (runtimeSeconds: number) => {
    const SECONDS_IN_DAY = 60 * 60 * 24;
    const SECONDS_IN_HOUR = 60 * 60;
    const SECONDS_IN_MINUTE = 60;
    const days = Math.floor(runtimeSeconds / SECONDS_IN_DAY);
    const hours = Math.floor((runtimeSeconds - (days * SECONDS_IN_DAY)) / SECONDS_IN_HOUR);
    const minutes = Math.floor((runtimeSeconds - (days * SECONDS_IN_DAY) - (hours * SECONDS_IN_HOUR)) / SECONDS_IN_MINUTE);
    const seconds = runtimeSeconds - minutes * 60;

    const timeStringParts: string[] = [];
    if (days > 0) {
      timeStringParts.push(formatPlural('day', days));
    }
    if (days > 0 || hours > 0) {
      timeStringParts.push(formatPlural('hour', hours));
    }
    if (days === 0 && runtimeSeconds >= SECONDS_IN_MINUTE) {
      timeStringParts.push(formatPlural('min', minutes));
    }
    if (runtimeSeconds < SECONDS_IN_HOUR) {
      timeStringParts.push(formatPlural('sec', seconds));
    }
    return timeStringParts.join(', ');
  }

  getHeapFreeKb({ freeHeapBytes }: AppInfo) {
    const heapFreeKbFormatted = (freeHeapBytes / 1000).toFixed(1);
    return `${heapFreeKbFormatted} kB`;
  }

  getEstimatedCurrent({ amps }: AppLedInfo) {
    let estimatedCurrent = 'Not calculated';
    if (amps > 1000) {
      amps /= 1000;
      const ampsFormatted = amps.toFixed(amps >= 10 ? 0 : 1);
      estimatedCurrent = `${ampsFormatted} A`;
    } else if (amps > 0) {
      // TODO is this rounding really necessary?
      // rounds to the nearest 50
      amps = 50 * Math.round(amps / 50);
      estimatedCurrent = `${amps} mA`;
    }
    return estimatedCurrent;
  }

  getFileSystemStats({
    usedSpaceKb,
    totalSpaceKb,
  }: AppFileSystemInfo) {
    const usedPercent = usedSpaceKb / totalSpaceKb * 100;
    return `${usedSpaceKb} / ${totalSpaceKb} kB (${Math.round(usedPercent)}%)`;
  }
}
