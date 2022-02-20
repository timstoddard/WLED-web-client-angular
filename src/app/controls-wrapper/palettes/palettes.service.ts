import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingService } from '../../shared/unsubscribing.service';
import { ColorSlotsService } from '../color-inputs/color-slots/color-slots.service';
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
  private sortedPalettes!: PaletteWithBackground[];
  private filteredPalettes$: BehaviorSubject<PaletteWithBackground[]>;
  private selectedPaletteName$: BehaviorSubject<string>;
  private paletteNames: string[] = [];
  private filterText!: string;

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private colorSlotsService: ColorSlotsService,
    private route: ActivatedRoute,
  ) {
    super();

    this.filteredPalettes$ = new BehaviorSubject<PaletteWithBackground[]>([]);
    this.selectedPaletteName$ = new BehaviorSubject<string>(this.getPaletteName(NONE_SELECTED));

    this.appStateService.getPalettes(this.ngUnsubscribe)
      .subscribe(palettes => {
        this.paletteNames = palettes;
        this.sortedPalettes = this.sortPalettes();
      });

    this.colorSlotsService.getSelectedColor()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        // update palettes that use color slots
        this.sortedPalettes = this.sortPalettes();
        // TODO find a way to do this without passing `this.filterText`
        this.filterPalettes(this.filterText);
      });
  }

  setPalette(paletteId: number) {
    const selectedPaletteName = this.getPaletteName(paletteId);
    this.selectedPaletteName$.next(selectedPaletteName);
    return paletteId !== NONE_SELECTED
      ? this.apiService.setPalette(paletteId)
      : null;
  }

  getSelectedPaletteName() {
    return this.selectedPaletteName$;
  }

  getFilteredPalettes() {
    return this.filteredPalettes$;
  }

  /**
   * Emits a list of all palettes whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * @param filterText 
   * @returns 
   */
  filterPalettes(filterText = '') {
    this.filterText = filterText.toLowerCase();
    const filteredPalettes = this.sortedPalettes
      .filter((palette) => palette.name.toLowerCase().includes(this.filterText));
    this.filteredPalettes$.next(filteredPalettes);
  }

  /** Sorts the palettes based on their names and joins with background data. */
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
    // TODO for better perf, should only update non-fixed palettes (cache fixed palettes)
    // also the "random" background shouldn't regenerate on color slot change
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
      const colorData = paletteColor[j];
      let r;
      let g;
      let b;
      const colorDataIsArray = Array.isArray(colorData);
      const percent = colorDataIsArray
        ? colorData[0] / 255 * 100
        : j / paletteColor.length * 100;
      if (colorDataIsArray) {
        r = colorData[1];
        g = colorData[2];
        b = colorData[3];
      } else if (colorData === 'r') {
        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;
      } else if (colorData[0] === 'c') {
        // TODO make # of color slots variable
        // element = 'c1' or 'c2' or 'c3'
        let slot = parseInt(colorData[1], 10) - 1;
        const rgb = this.colorSlotsService.getColorRgb(slot);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
      }

      gradient.push(`rgb(${r},${g},${b}) ${percent}%`);
    }

    return `linear-gradient(to right,${gradient.join()})`;
  }

  private getPaletteName(paletteId: number) {
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
}
