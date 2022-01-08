import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restart',
  templateUrl: './restart.component.html',
  styleUrls: ['./restart.component.scss']
})
export class RestartComponent implements OnInit {
  isRestarting: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  doRestart() {
    this.isRestarting = true;
    // TODO implement
    setTimeout(() => this.isRestarting = false, 2000);
  }

  getMessage() {
    return this.isRestarting
      ? 'Restarting! Please wait about 10 seconds.'
      : 'Click the button to restart your WLED controller.';
  }
}
