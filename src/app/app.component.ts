import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { LocalStorageKey, LocalStorageService } from './shared/local-storage.service';
import { PageTitleService } from './shared/page-title.service';
import { UnsubscriberComponent } from './shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends UnsubscriberComponent {
  showDevNavBar!: boolean;
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
    private metaTagService: Meta,
  ) {
    super();
  }

  ngOnInit() {
    this.addMetaTags();

    this.showDevNavBar = false;

    this.pageTitleService.updateOnRouteChange(this.ngUnsubscribe);
    this.showDevNavBar = this.localStorageService.get(LocalStorageKey.SHOW_DEV_NAV_BAR, false);
  }

  // TODO control hiding loading animation from the router
  ngAfterViewInit() {
    this.hideLoadingAnimation();
  }

  hideLoadingAnimation() {
    const loader = document.querySelector('.pre-js-loader') as HTMLDivElement;
    loader.style.opacity = '0';
    loader.style.visibility = 'false';
  }

  hideDevNavBar() {
    this.showDevNavBar = false;
    this.localStorageService.set(LocalStorageKey.SHOW_DEV_NAV_BAR, false);
  }

  private addMetaTags() {
    const tags: MetaDefinition[] = [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: this.getViewportMetaContent(),
      },
      {
        name: 'theme-color',
        // TODO different theme color?
        content: '#222222',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
    ];
    this.metaTagService.addTags(tags);
  }

  private getViewportMetaContent() {
    const content = Object.entries({
      width: 'device-width',
      height: 'device-height',
      'initial-scale': 1,
      'minimum-scale': 1,
      'user-scalable': 'no',
    })
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    return content;
  }
}
