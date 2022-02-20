import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalStorageService } from './shared/local-storage.service';
import { PageTitleService } from './shared/page-title.service';
import { UnsubscribingComponent } from './shared/unsubscribing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends UnsubscribingComponent {
  showDevNavBar: boolean = false;
  links = [
    {
      path: 'controls',
      component: 'Controls',
    },
    {
      path: 'dmxmap',
      component: 'DmxMap',
    },
    {
      path: 'edit',
      component: 'Edit',
    },
    {
      path: 'live',
      component: 'LiveView',
    },
    {
      path: 'quick-stats',
      component: 'QuickStats',
    },
    {
      path: 'restart',
      component: 'Restart',
    },
    {
      path: 'settings',
      component: 'Settings',
    },
    {
      path: 'teapot',
      component: 'Teapot',
    },
    {
      path: 'update',
      component: 'Update',
    },
    {
      path: 'u',
      component: 'UserModPage',
    },
    {
      path: 'welcome',
      component: 'Welcome',
    },
  ];

  constructor(
    private pageTitleService: PageTitleService,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.pageTitleService.updateOnRouteChange(this.ngUnsubscribe);
    this.showDevNavBar = this.localStorageService.get('showDevNavBar')!;
  }

  hideDevNavBar() {
    this.showDevNavBar = false;
    this.localStorageService.set('showDevNavBar', false);
  }
}
