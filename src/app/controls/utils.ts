// used by top and bottom menu bars
export interface MenuBarButton {
  name: string;
  onClick: () => void;
  icon: string;
}

// used for sorting effect/palette lists
export const compareNames = (a: any /* TODO type */, b: any /* TODO type */) =>
  a.name < b.name ? -1 : 1;

// used by info & nodes comps
export const inforow = (key: string, value: string, unit = '') =>
  `<tr><td class="keytd">${key}</td><td class="valtd">${value}${unit}</td></tr>`;

// TODO is there a more generic/imported version of this on npm (or in angular)
export const isObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item);

/**
 * Updates the colored in background to the left of the slider button.
 * Updates the 'sliderdisplay' background div of a slider for a visual indication of slider position.
 * @param e 
 * @returns 
 */
export const updateSliderTrail = (e: HTMLInputElement) => {
  if (e === null) {
    return;
  }
  const max = e.hasAttribute('max')
    ? (e.attributes as any).max.value
    : 255;
  let percent = parseInt(e.value, 10) * 100 / max;
  if (percent < 50) {
    percent += 2;
  }
  const val = `linear-gradient(90deg, var(--bg) ${percent}%, var(--c-4) ${percent}%)`;
  ((e.parentNode! as HTMLElement)
    .getElementsByClassName('sliderdisplay')[0] as HTMLElement)
    .style.background = val;
}

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
