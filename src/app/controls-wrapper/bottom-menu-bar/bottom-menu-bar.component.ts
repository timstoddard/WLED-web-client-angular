import { Component, OnInit } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-bottom-menu-bar',
  templateUrl: './bottom-menu-bar.component.html',
  styleUrls: ['./bottom-menu-bar.component.scss']
})
export class BottomMenuBarComponent extends UnsubscriberComponent implements OnInit {
  showLabels!: boolean;
  buttons = [
    {
      name: 'Segments',
      routerLink: ['/controls', 'segments'],
      routerLinkActiveExactMatch: false,
      icon: 'category',
    },
    {
      name: 'Presets',
      routerLink: ['/controls', 'presets'],
      routerLinkActiveExactMatch: false,
      icon: 'favorite',
    },
    {
      name: 'Controls',
      routerLink: ['/controls'],
      routerLinkActiveExactMatch: true,
      icon: 'tune',
    },
    {
      name: 'Info',
      routerLink: ['/controls', 'info'],
      routerLinkActiveExactMatch: false,
      icon: 'info',
    },
    {
      name: 'Settings',
      routerLink: ['/controls', 'settings'],
      routerLinkActiveExactMatch: false,
      icon: 'settings',
    },
  ];

  constructor(private uiConfigService: UIConfigService) {
    super();
  }

  ngOnInit() {
    this.handleUnsubscribe(
      this.uiConfigService.getUIConfig(this.ngUnsubscribe))
      .subscribe(({ showLabels }) => {
        this.showLabels = showLabels;
      })
  }
}
