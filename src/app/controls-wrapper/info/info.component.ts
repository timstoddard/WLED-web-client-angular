import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppFileSystemInfo, AppInfo, AppLedInfo } from '../../shared/app-types';
import { UnsubscriberComponent } from '../../shared/unsubscribing/unsubscriber.component';
import { formatPlural } from '../utils';
import { InfoService } from './info.service';

interface InfoButton {
  name: string;
  icon: string;
  onClick: () => void;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent extends UnsubscriberComponent implements OnInit {
  versionName!: string;
  versionId!: number;
  infoRows: KeyValue<string, unknown>[] = [];
  buttons = this.getButtons();
  private confirmedRestart = false;

  constructor(
    private infoService: InfoService,
    private appStateService: AppStateService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(({ info }) => {
        this.versionName = info.versionName;
        this.versionId = info.versionId;
        this.infoRows = [];

        // TODO need to test this somehow
        // adds user mod related info
        const userModInfo = (info as any).u;
        if (userModInfo) {
          for (const [key, val] of Object.entries(userModInfo)) {
            this.infoRows.push({
              key,
              value: Array.isArray(val) ? val.join(' ') : val,
            });
          }
        }

        this.infoRows = [
          {
            key: 'Build',
            value: info.versionId,
          },
          {
            key: 'Signal Strength',
            value: `${info.wifi.signalStrength}% (${info.wifi.rssi} dBm)`,
          },
          {
            key: 'Uptime',
            value: this.getRuntimeString(info.uptimeSeconds),
          },
          {
            key: 'Heap Free Space',
            value: this.getHeapFreeKb(info),
          },
          {
            key: 'Current (estimated)',
            value: this.getEstimatedCurrent(info.ledInfo),
          },
          {
            key: 'FPS',
            value: info.ledInfo.fps,
          },
          {
            key: 'MAC Address',
            value: info.macAddress,
          },
          {
            key: 'File System',
            value: this.getFileSystemStats(info.fileSystem),
          },
          {
            key: 'Environment',
            value: `${info.platform} ${info.arduinoVersion}`,
          },
        ]
      });
  }

  getVersionNickname() {
    // TODO is there an absolute list of these nicknames?
    const isV13 = this.versionId.toString().startsWith('0.13.');
    return isV13
      ? 'Toki'
      : 'Kuuhaku';
  }

  refresh() {
    this.infoService.refreshAppState();
  }

  showNodes() {
    // TODO: was `toggleNodes()`
  }

  doRestart() {
    if (!this.confirmedRestart) {
      this.confirmedRestart = true;
      // TODO button changes style & says 'Confirm Restart'
      // const bt = document.getElementById('resetbtn')!;
      // bt.style.color = '#f00';
      // bt.innerHTML = 'Confirm Restart';
    } else {
      this.router.navigateByUrl('/restart');
    }
  }

  // TODO move to a service, add unit tests!
  private getRuntimeString = (runtimeSeconds: number) => {
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

  getCurrentYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  private getButtons(): InfoButton[] {
    return [
      {
        name: 'Refresh',
        icon: 'refresh',
        onClick: () => this.refresh(),
      },
      {
        name: 'Restart Device',
        icon: 'power_settings_new',
        onClick: () => this.doRestart(),
      },
      // TODO make a toggle switch for showing this
      // OR just make it part of info screen
      {
        name: 'All Devices',
        icon: 'list',
        onClick: () => this.showNodes(),
      },
    ];
  }

  private getHeapFreeKb({ freeHeapBytes  }: AppInfo) {
    const heapFreeKbFormatted = (freeHeapBytes / 1000).toFixed(1);
    return `${heapFreeKbFormatted} kB`;
  }

  private getEstimatedCurrent({ amps }: AppLedInfo) {
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

  private getFileSystemStats({
    usedSpaceKb,
    totalSpaceKb,
  }: AppFileSystemInfo) {
    const usedPercent = usedSpaceKb / totalSpaceKb * 100;
    return `${usedSpaceKb} / ${totalSpaceKb} kB (${Math.round(usedPercent)}%)`;
  }
}
