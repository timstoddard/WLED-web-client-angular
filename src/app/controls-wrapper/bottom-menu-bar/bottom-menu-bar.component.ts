import { Component, Input, OnInit } from '@angular/core';
import { updateTablinks } from '../utils';

@Component({
  selector: 'app-bottom-menu-bar',
  templateUrl: './bottom-menu-bar.component.html',
  styleUrls: ['./bottom-menu-bar.component.scss']
})
export class BottomMenuBarComponent implements OnInit {
  @Input() pcMode: boolean = false; // TODO is this needed?

  ngOnInit() {
  }

  getRouterLinks() {
    return [
      {
        name: 'Controls',
        routerLink: ['../', 'controls'],
        icon: '&#xe2b3;',
      },
      {
        name: 'Segments',
        routerLink: ['./', 'segments'],
        icon: '&#xe34b;',
      },
      {
        name: 'Presets',
        routerLink: ['./', 'presets'],
        icon: '&#xe04c;',
      },
      {
        name: 'Settings',
        routerLink: ['../', 'settings'],
        icon: '&#xe2b3;',
      },
    ]
  }

  // TODO no longer used
  private openTab(tabIndex: number, force = false) {
    if (this.pcMode && !force) {
      return;
    }
    updateTablinks(tabIndex);

    // TODO update sliding UI
    // this.iSlide = tabIndex;
    // this.sliderContainer.classList.toggle('smooth', false);
    // this.sliderContainer.style.setProperty('--i', this.iSlide);
  }
}
