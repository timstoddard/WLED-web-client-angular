import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames } from '../utils';

// TODO do these types belong here?
export type PaletteColor = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

export interface PaletteColors {
  [key: number]: PaletteColor;
}

export interface PalettesData {
  p: PaletteColors;
  m: number;
}

export interface PaletteBackground {
  id: number;
  name: string;
  background: string;
}

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesService {
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute) {}

  // TODO is this needed?
  getPalettes() {
    return this.apiService.getPalettes();
  }

  setPalette(paletteId: number) {
    return this.apiService.setPalette(paletteId);
  }

  getSortedPalettes(defaultPaletteId: number) {
    const paletteNames = (this.route.snapshot.data['data'] as WledApiResponse).palettes;
    const backgrounds = this.generatePaletteBackgrounds();

    const sortedPalettes = paletteNames.slice(1) // remove 'Default'
      .map((name, i) => ({
        id: i + 1,
        name,
        background: backgrounds[i + 1],
      }));
    sortedPalettes.sort(compareNames);
    sortedPalettes.unshift({
      id: defaultPaletteId,
      name: 'Default',
      background: backgrounds[defaultPaletteId],
    });

    return sortedPalettes;
  }

  private generatePaletteBackgrounds() {
    const paletteColors = this.getPalettesData();
    const backgrounds: { [key: number]: string } = {};
    for (const id in paletteColors) {
      backgrounds[id] = this.generatePaletteBackgroundCss(paletteColors[id]);
    }
    return backgrounds;
  }

  private getPalettesData() {
    const palettesData = this.route.snapshot.data['palettesData'] as PalettesData[];
    let allPalettesData: PaletteColors = {};
    for (const paletteData of palettesData) {
      allPalettesData = Object.assign({}, allPalettesData, paletteData.p);
    }
    return allPalettesData;
  }

  private generatePaletteBackgroundCss(paletteColor: PaletteColor) {
    if (!paletteColor || paletteColor.length === 0) {
      return '';
    }

    // need at least two colors for a gradient
    if (paletteColor.length === 1) {
      paletteColor[1] = paletteColor[0];
      if (Array.isArray(paletteColor[1])) {
        // set x position to max
        paletteColor[1][0] = 255;
      }
    }

    const gradient = [];
    for (let j = 0; j < paletteColor.length; j++) {
      const element = paletteColor[j];
      let r;
      let g;
      let b;
      let percent = -1;
      if (Array.isArray(element)) {
        percent = element[0] / 255 * 100;
        r = element[1];
        g = element[2];
        b = element[3];
      } else if (element === 'r') {
        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;
      }
      // TODO get selColors from somewhere (color service?)
      /*else if (this.selColors) {
        // element = 'c1' or 'c2' or 'c3'
        // TODO update if # of selColors is made variable
        let pos = parseInt(element[1], 10) - 1;
        r = this.selColors[pos][0];
        g = this.selColors[pos][1];
        b = this.selColors[pos][2];
      }*/
      if (percent === -1) {
        percent = j / paletteColor.length * 100;
      }

      gradient.push(`rgb(${r},${g},${b}) ${percent}%`);
    }

    return `linear-gradient(to right,${gradient.join()})`;
  }
}
