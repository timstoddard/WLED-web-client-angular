import { Component, Input, OnInit } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-bottom-menu-bar',
  templateUrl: './bottom-menu-bar.component.html',
  styleUrls: ['./bottom-menu-bar.component.scss']
})
export class BottomMenuBarComponent extends UnsubscriberComponent implements OnInit {
  @Input() pcMode: boolean = false; // TODO is this needed?
  showLabels!: boolean;
  buttons = [
    {
      name: 'Segments',
      routerLink: ['/controls', 'segments'],
      icon: 'category',
    },
    {
      name: 'Presets',
      routerLink: ['/controls', 'presets'],
      icon: 'favorite',
    },
    {
      name: 'Controls',
      routerLink: ['/controls'],
      icon: 'tune',
    },
    {
      name: 'Info',
      routerLink: ['/controls', 'info'],
      icon: 'info',
    },
    {
      name: 'Settings',
      routerLink: ['/controls', 'settings'],
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
