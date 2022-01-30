import { Component, Input, OnInit } from '@angular/core';
import { MenuBarButton, updateTablinks } from '../utils';

@Component({
  selector: 'app-bottom-menu-bar',
  templateUrl: './bottom-menu-bar.component.html',
  styleUrls: ['./bottom-menu-bar.component.scss']
})
export class BottomMenuBarComponent implements OnInit {
  @Input() pcMode: boolean = false;

  ngOnInit() {
  }

  getButtons(): MenuBarButton[] {
    return [
      {
        name: 'Controls',
        onClick: () => this.openTab(0),
        icon: '&#xe2b3;',
        enabled: false, // TODO
      },
      {
        name: 'Segments',
        onClick: () => this.openTab(1),
        icon: '&#xe34b;',
        enabled: false, // TODO
      },
      {
        name: 'Presets',
        onClick: () => this.openTab(2),
        icon: '&#xe04c;',
        enabled: false, // TODO
      },
    ];
  }

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
