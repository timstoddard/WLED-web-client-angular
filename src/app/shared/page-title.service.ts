import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, LoadChildrenCallback, NavigationEnd, Route, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UnsubscriberService } from './unsubscribing/unsubscriber.service';

const DEFAULT_PAGE_TITLE = 'WLED';

/** All routes must either have a defined page title or a lazy loaded module. */
export type RouteWithPageTitle = RouteWithDefinedPageTitle | RouteWithLazyLoadedModule;

interface RouteWithDefinedPageTitle extends Route {
  data: PageTitle;
  children?: RouteWithPageTitle[];
}

interface RouteWithLazyLoadedModule extends Route {
  loadChildren: LoadChildrenCallback;
}

interface PageTitle {
  title: string;
}

@Injectable({ providedIn: 'root' })
export class PageTitleService extends UnsubscriberService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
    super();
  }

  // TODO add unit tests
  /**
   * Updates the page title whenever the page url changes, using data from the routing config.
   * 
   * To set the title data, see the relevant routing module.
   * @param ngUnsubscribe used for unsubscribing, should be passed from a Component that extends `UnsubscribingComponent`
   */
  updateOnRouteChange(ngUnsubscribe: Subject<void>) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(ngUnsubscribe),
    )
    .subscribe(() => {
      const currentChildRoute = this.getChild(this.activatedRoute);
      if (currentChildRoute && currentChildRoute.data) {
        const routeData = currentChildRoute.data as Observable<PageTitle>;
        this.handleUnsubscribe(routeData)
          .subscribe(data => {
            const newTitle = data.title || DEFAULT_PAGE_TITLE;
            this.titleService.setTitle(newTitle);
          });
      } else {
        console.warn(`Could not find title data for route: ${this.activatedRoute.toString()}`);
        this.titleService.setTitle(DEFAULT_PAGE_TITLE);
      }
    });
  }

  /**
   * Finds the deepest child route.
   * 
   * For example, if the current url is `/foo/bar`, it will return the `bar` route.
   * @param activatedRoute current activated route
   * @returns the deepest child route
   */
  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    return activatedRoute && activatedRoute.firstChild
      ? this.getChild(activatedRoute.firstChild)
      : activatedRoute;
  }
}
