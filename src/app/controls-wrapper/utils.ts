import { ActivatedRoute } from '@angular/router';

// TODO move elsewhere
// used by top and bottom menu bars
export interface MenuBarButton {
  name: string;
  onClick: () => void;
  icon: string;
  enabled: () => boolean;
}

// used for sorting effect/palette lists
interface HasName { name: string; }
export const compareNames = (a: HasName, b: HasName) =>
  a.name < b.name ? -1 : 1;

// used by info & nodes comps
export const inforow = (key: string, value: string, unit = '') =>
  `<tr><td class="keytd">${key}</td><td class="valtd">${value}${unit}</td></tr>`;

// TODO is there a more generic/imported version of this on npm (or in angular)
export const isObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item);

/**
 * Returns the html input element with the given ID.
 * @param id element ID
 * @returns 
 */
export const getInput = (id: string) => {
  return (document.getElementById(id) as HTMLInputElement)!;
}

/**
 * Converts a `NodeListOf<Element>` to `HTMLElement[]`. Query is passed to `document.querySelectorAll`.
 * @param query Input to `document.querySelectorAll`
 * @returns 
 */
export const getElementList = (query: string) => {
  const elements = document.querySelectorAll(query);
  return Array.from(elements) as HTMLElement[];
}

export const asHtmlElem = (e: Element) => e as HTMLElement;

export const setCssColor = (name: string, color: string) => {
  document.documentElement.style.setProperty(name, color);
}

export const updateTablinks = (tabIndex: number) => {
  // TLDR: if not pc mode, add `active` class to selected tab link

  // TODO remove active class from all tab links
  // const tabLinks = getElementList('tablinks');
  // for (const tabLink of tabLinks) {
  //   tabLink.className = tabLink.className.replace(' active', '');
  // }

  // TODO if not pc mode, add active class to selected tab link
  // if (this.pcMode) {
  //   return;
  // }
  // tabLinks[tabIndex].className += ' active';
}

/**
 * Searches up the current route tree to find route data for the given key.
 * @param key 
 * @param route 
 * @returns 
 */
export const findRouteData = (key: string, route: ActivatedRoute | null): unknown => {
  if (route) {
    if (route.snapshot.data[key]) {
      return route.snapshot.data[key];
    } else {
      return findRouteData(key, route.parent);
    }
  }
  return null;
}

/**
 * Formats the `type` based on whether or not `count` is plural.
 * @param type 
 * @param count 
 * @returns 
 */
export const formatPlural = (type: string, count: number) => {
  return `${count} ${type}${count !== 1 ? 's' : ''}`;
}
