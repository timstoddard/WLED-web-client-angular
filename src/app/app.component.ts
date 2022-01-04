import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { UnsubscribingComponent } from './shared/unsubscribing-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends UnsubscribingComponent {
  title = 'WLED-Web-Client';

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
      path: 'reset',
      component: 'Reset',
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {
      super();
  }

  ngOnInit() {
    // TODO move into service
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.ngUnsubscribe),
    )
    .subscribe(() => {
      const routeTitle = this.getChild(this.activatedRoute);
      const DEFAULT_TITLE = 'WLED';
      if (routeTitle) {
        routeTitle.data.subscribe(data => {
          console.log(data);
          // TODO do this without `any`
          const newTitle = (data as any).title || DEFAULT_TITLE;
          this.titleService.setTitle(newTitle);
        });
      } else {
        console.warn(`Could not find title for route: ${this.activatedRoute.toString()}`);
      }
    });
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    return activatedRoute.firstChild
      ? this.getChild(activatedRoute.firstChild)
      : activatedRoute;
  }
}
