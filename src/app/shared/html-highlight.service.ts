import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class HtmlHighlightService {
  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  // TODO needs unit tests
  highlightHtmlText(
    htmlText: string,
    filterText: string,
    highlightClass: string,
    htmlStringsToIgnore: string[] = [],
  ) {
    let highlightedText: string | SafeHtml = htmlText;

    if (filterText) {
      const regExpStringsToIgnore = `(${htmlStringsToIgnore.join('|')})?`
      const filterTextRegExp = filterText.split('').join(regExpStringsToIgnore);
      const highlighted = htmlText
          .replace(
            new RegExp(`(${filterTextRegExp})`, 'gi'),
            `<span class="${highlightClass}">$1</span>`,
          );
      highlightedText = this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    return highlightedText;
  }
}
