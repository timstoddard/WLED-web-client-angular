import { Component, Input, OnInit } from '@angular/core';
import { inforow } from '../utils';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() info: any; // TODO type
  versionName!: string;
  heap!: string;
  inforow = inforow; // for use in template
  estimatedCurrent!: string;
  totalRuntimeString = '';
  private confirmedReboot = false;
  private hc = 0;

  constructor() { }

  ngOnInit() {
    this.heap = (this.info.freeheap / 1000).toFixed(1);

    if (this.info.cn) {
      this.versionName = this.info.cn;
    } else {
      this.versionName = 'Kuuhaku';
      if (this.info.ver.startsWith('0.13.')) {
        this.versionName = 'Toki';
      }
    }

    let current = this.info.leds.pwr;
    this.estimatedCurrent = 'Not calculated';
    if (current > 1000) {
      current /= 1000;
      current = current.toFixed(current > 10 ? 0 : 1);
      this.estimatedCurrent = `${current} A`;
    } else if (current > 0) {
      current = 50 * Math.round(current / 50);
      this.estimatedCurrent = `${current} mA`;
    }

    // TODO figure this part out (user mod related?)
    let urows = ''
    if (this.info.u) {
      for (const [k, val] of Object.entries(this.info.u)) {
        // TODO fix type issue
        const valTypeFix = val as any;
        if (valTypeFix[1]) {
          urows += inforow(k, valTypeFix[0], valTypeFix[1]);
        } else {
          urows += inforow(k, valTypeFix);
        }
      }
    }

    this.totalRuntimeString = this.getRuntimeString(this.info.uptime);
  }

  refresh() {
    // TODO: was `requestJson(null)`
  }

  close() {
    // TODO: was `toggleInfo()`
  }

  showNodes() {
    // TODO: was `toggleNodes()`
  }

  doReboot() {
    if (!this.confirmedReboot) {
      this.confirmedReboot = true;
      // TODO reboot button changes style & says 'Confirm Reboot'
      // const bt = document.getElementById('resetbtn')!;
      // bt.style.color = '#f00';
      // bt.innerHTML = 'Confirm Reboot';
      // return;
    } else {
      window.location.href = '/reboot';
    }
  }

  // TODO cache this value
  private getRuntimeString = (runtimeSeconds: string /* TODO shouldnt this be a number? */) => {
    const time = parseInt(runtimeSeconds, 10);
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time - days * 86400) / 3600);
    const minutes = Math.floor((time - days * 86400 - hours * 3600) / 60);
    let timeString = days ? (days + ' ' + (days === 1 ? 'day' : 'days') + ', ') : '';
    timeString += (hours || days) ? (hours + ' ' + (hours === 1 ? 'hour' : 'hours')) : '';
    if (!days) {
      if (hours) {
        timeString += ', ';
      }
      if (time > 59) {
        timeString += minutes + ' min';
      }
    }
    if (time < 3600) {
      if (time > 59) {
        timeString += ', ';
      }
      timeString += (time - minutes * 60) + ' sec';
    }
    return timeString;
  }

  private cycleHeartIconColor() {
    // TODO make a function for this
    // TODO store interval
    setInterval(() => {
      // TODO clear this interval when info not shown
      // if (!this.isInfo) {
      //   return;
      // }
      this.hc += 18;
      if (this.hc > 300) {
        this.hc = 0;
      }
      if (this.hc > 200) {
        this.hc = 306;
      }
      if (this.hc === 144) {
        this.hc += 36;
      }
      if (this.hc === 108) {
        this.hc += 18;
      }
      document.getElementById('heart')!.style.color = `hsl(${this.hc}, 100%, 50%)`;
    }, 910);
  }
}
