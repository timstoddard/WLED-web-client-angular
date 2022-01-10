import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-restart',
  templateUrl: './restart.component.html',
  styleUrls: ['./restart.component.scss']
})
export class RestartComponent implements OnInit, OnDestroy {
  isRestarting: boolean = false;
  restartTimeout: number = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearTimeout(this.restartTimeout);
  }

  doRestart() {
    this.isRestarting = true;
    // TODO implement
    this.restartTimeout = setTimeout(() =>
      this.isRestarting = false, 2000) as unknown as number;
  }

  getMessage() {
    return this.isRestarting
      ? 'Restarting! Please wait about 10 seconds.'
      : 'Click the button to restart your WLED controller.';
  }
}
