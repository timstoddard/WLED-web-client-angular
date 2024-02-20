import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class HtmlHighlightService {
  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Generates html that wraps any instances of the filterText in the htmlText so they can appear highlighted.
   * @param htmlText text to search through
   * @param filterText string to look for in htmlText
   * @param highlightClass css classname for highlight styles
   * @param htmlStringsToIgnore html strings that we don't want to match
   * @returns 
   */
  highlightHtmlText(
    htmlText: string,
    filterText: string,
    highlightClass: string,
    htmlStringsToIgnore: string[] = [],
  ) {
    let highlightedText: string | SafeHtml = htmlText;
    if (filterText) {
      const filterTextRegex = this.buildFilterTextRegex(filterText, htmlStringsToIgnore);
      const highlighted = htmlText
        .replace(
          new RegExp(`(${filterTextRegex})`, 'gi'),
          `<span class="${highlightClass}">$1</span>`,
        );
      highlightedText = this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    return highlightedText;
  }

  /**
   * Builds regex to find the filter text without matching any html characters.
   * Uses negative lookarounds to avoid matching html characters.
   * @param filterText 
   * @param htmlStringsToIgnore html strings that we don't want to match
   * @returns 
   */
  private buildFilterTextRegex(
    filterText: string,
    htmlStringsToIgnore: string[],
  ) {
    const negativeLookaheads = [];
    const negativeLookbehinds = [];

    for (const htmlString of htmlStringsToIgnore) {
      const lastStartIndex = htmlString.length - filterText.length;
      // loop over every filterText-length substring in htmlString
      for (let i = 0; i < lastStartIndex; i++) {
        const start = i;
        const end = i + filterText.length;
        if (htmlString.substring(start, end) === filterText) {
          // filter text is a substring of an html string, so
          // add negative lookarounds to avoid matching the html
          negativeLookaheads.push(htmlString.substring(0, start));
          negativeLookbehinds.push(htmlString.substring(end, htmlString.length));
        }
      }
    }

    const filterTextRegex = [
      ...negativeLookaheads.map(s => `(?<!${s})`),
      filterText.split('').join(`(${htmlStringsToIgnore.join('|')})?`),
      ...negativeLookbehinds.map(s => `(?!${s})`),
    ].join('');
    return filterTextRegex;
  }
}
