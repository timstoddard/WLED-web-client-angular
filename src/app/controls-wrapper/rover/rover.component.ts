import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.scss']
})
export class RoverComponent implements OnInit {
  // TODO still not entirely sure what this component does

  constructor() { }

  ngOnInit() {
  }

  setLiveViewOverride(lor: number) { // TODO better name ("set light override??")
    // TODO this.roverService.setLiveViewOverride()
  }

  displayRover(info: any /* TODO type */, state: any /* TODO type */) {
    document.getElementById('rover')!.style.transform =
      (info.live && state.lor === 0)
        ? 'translateY(0px)'
        : 'translateY(100%)';
    let source = info.lip ? info.lip : '';
    if (source.length > 2) {
      source = ' from ' + source;
    }
    document.getElementById('lv')!.innerHTML =
      `WLED is receiving live ${info.lm} data${source}`;
    document.getElementById('roverstar')!.style.display =
      (info.live && state.lor)
        ? 'block'
        : 'none';
  }
}
