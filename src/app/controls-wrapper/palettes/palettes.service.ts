import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingService } from '../../shared/unsubscribing.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames, findRouteData } from '../utils';

// TODO do these types belong here?
export type PaletteColor = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

export interface PaletteColors {
  [key: number]: PaletteColor;
}

export interface PalettesData {
  p: PaletteColors;
  m: number;
}

export interface PaletteWithBackground {
  id: number;
  name: string;
  background: string;
}

const NONE_SELECTED = -1;

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesService extends UnsubscribingService {
  sortedPalettes!: PaletteWithBackground[];
  private selectedPaletteName!: string;
  private paletteNames: string[] = [];

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
  ) {
    super();
    this.appStateService.getPalettes(this.ngUnsubscribe)
      .subscribe(palettes => {
        this.paletteNames = palettes;
        this.sortedPalettes = this.sortPalettes();
      });
  }

  setPalette(paletteId: number) {
    this.selectedPaletteName = this.getPaletteName(paletteId);
    return paletteId !== NONE_SELECTED
      ? this.apiService.setPalette(paletteId)
      : null;
  }

  getPaletteName(paletteId: number) {
    if (paletteId === NONE_SELECTED) {
      return 'none';
    }
    if (this.sortedPalettes && this.sortedPalettes.length > 0) {
      const selectedPalette = this.sortedPalettes
        .find(((n) => n.id === paletteId));
      if (selectedPalette) {
        return selectedPalette.name;
      }
    }
    return '';
  }

  getSelectedPaletteName() {
    return this.selectedPaletteName;
  }

  /**
   * Returns a list of all palettes whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * @param filterText 
   * @returns 
   */
  getFilteredPalettes(filterText = '') {
    const filterTextLowercase = filterText.toLowerCase();
    const filteredPalettes = this.sortedPalettes
      .filter((palette) => palette.name.toLowerCase().includes(filterTextLowercase));
    return filteredPalettes;
  }

  private sortPalettes() {
    const backgrounds = this.generatePaletteBackgrounds();
    const sortedPalettes = this.paletteNames.slice(1) // remove 'Default'
      .map((name, i) => ({
        id: i + 1,
        name,
        background: backgrounds[i + 1],
      }));
    sortedPalettes.sort(compareNames);
    sortedPalettes.unshift({
      id: 0,
      name: 'Default',
      background: backgrounds[0],
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
    // TODO get from app state?
    const palettesData = findRouteData('palettesData', this.route) as PalettesData[];
    let allPalettesData: PaletteColors = {};
    for (const paletteData of palettesData) {
      allPalettesData = { ...allPalettesData, ...paletteData.p };
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
