import { Injectable } from '@angular/core';

export interface LiveViewData {
  leds: string[];
  n: number;
}

@Injectable({ providedIn: 'root' }) // TODO create live view services module?
export class LiveViewService {
  getBackgroundString(leds: string[]) {
    // TODO this logic was written to fill the background of a div, need to translate it to work with a canvas (is css background or canvas more performant?)
    const hexList = leds.map(ledData => {
      const hexFormatted = ledData.length > 6
        ? ledData.substring(2)
        : ledData;
      return `#${hexFormatted}`;
    }).join(',');
    return `linear-gradient(90deg,${hexList})`;
  }
}
