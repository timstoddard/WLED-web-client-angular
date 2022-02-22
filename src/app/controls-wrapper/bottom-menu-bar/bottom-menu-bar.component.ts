import { Component, Input, OnInit } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { updateTablinks } from '../utils';

@Component({
  selector: 'app-bottom-menu-bar',
  templateUrl: './bottom-menu-bar.component.html',
  styleUrls: ['./bottom-menu-bar.component.scss']
})
export class BottomMenuBarComponent extends UnsubscribingComponent implements OnInit {
  @Input() pcMode: boolean = false; // TODO is this needed?
  showLabels!: boolean;
  buttons = [
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
      icon: '&#xe0a2;',
    },
  ];

  constructor(private uiConfigService: UIConfigService) {
    super();
  }

  ngOnInit() {
    this.handleUnsubscribe(
      this.uiConfigService.getUIConfig(this.ngUnsubscribe))
      .subscribe((uiConfig) => {
        this.showLabels = uiConfig.showLabels;
      })
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
