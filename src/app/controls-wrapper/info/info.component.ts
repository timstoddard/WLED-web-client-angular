import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppInfo, AppNode } from '../../shared/app-types';
import { UnsubscriberComponent } from '../../shared/unsubscribing/unsubscriber.component';
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
  info!: AppInfo;
  nodes: AppNode[] = [];
  infoRows: KeyValue<string, unknown>[] = [];
  buttons = this.getButtons();

  constructor(
    private infoService: InfoService,
    private appStateService: AppStateService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(({ info, nodes }) => {
        this.info = info;
        this.nodes = nodes;
        this.updateInfoRows();
      });
    
    // TODO loading animation
    this.infoService.fetchNodes();
  }

  getVersionNickname() {
    // TODO is there an absolute list of these nicknames?
    const isV13 = this.info.versionId.toString().startsWith('0.13.');
    return isV13
      ? 'Toki'
      : 'Kuuhaku';
  }

  refresh() {
    this.infoService.refreshAppState();
  }

  doRestart() {
    // TODO this should trigger the restart
    this.router.navigateByUrl('/restart');
  }

  getCurrentYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  getDeviceName({ name, ipAddress }: AppNode) {
    return name === 'WLED'
      ? ipAddress
      : name;
  }

  getDeviceTypeName(deviceType: number) {
    switch (deviceType) {
      case 32:
        return 'ESP32';
      case 82:
        return 'ESP8266';
      default:
        return 'unknown';
    }
  }

  selectDevice(ipAddress: string) {
    // TODO update app state, switch device, and load data from api
    console.log('select', ipAddress);
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
    ];
  }

  private updateInfoRows() {
    const infoRows = [];

    // TODO need to test this somehow
    // adds user mod related info
    const userModInfo = (this.info as any).u;
    if (userModInfo) {
      for (const [key, val] of Object.entries(userModInfo)) {
        infoRows.push({
          key,
          value: Array.isArray(val) ? val.join(' ') : val,
        });
      }
    }

    // adds all standard stats
    infoRows.push(
      {
        key: 'Build',
        value: this.info.versionId,
      },
      {
        key: 'Signal Strength',
        value: `${this.info.wifi.signalStrength}% (${this.info.wifi.rssi} dBm)`,
      },
      {
        key: 'Uptime',
        value: this.infoService.getRuntimeString(this.info.uptimeSeconds),
      },
      {
        key: 'Heap Free Space',
        value: this.infoService.getHeapFreeKb(this.info),
      },
      {
        key: 'Current (estimated)',
        value: this.infoService.getEstimatedCurrent(this.info.ledInfo),
      },
      {
        key: 'FPS',
        value: this.info.ledInfo.fps,
      },
      {
        key: 'MAC Address',
        value: this.info.macAddress,
      },
      {
        key: 'File System',
        value: this.infoService.getFileSystemStats(this.info.fileSystem),
      },
      {
        key: 'Environment',
        value: `${this.info.platform} ${this.info.arduinoVersion}`,
      },
    );

    this.infoRows = infoRows;
  }
}
