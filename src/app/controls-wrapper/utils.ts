import { FormControl, FormGroup } from '@angular/forms';
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

export type getFormControlFn = (name: string) => FormControl;

/**
 * Simplifies the process of creating a function to return a specific form control
 * @param formGroup form group to get the form control from
 * @returns 
 */
export const createGetFormControl = (formGroup: FormGroup): getFormControlFn => {
  return (name: string) => {
    return formGroup.get(name) as FormControl;
  }
}
