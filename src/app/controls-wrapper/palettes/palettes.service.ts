import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppState } from '../../shared/app-types';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
import { ColorSlotsService } from '../color-inputs/color-slots/color-slots.service';
import { ControlsServicesModule } from '../controls-services.module';
import { compareNames, findRouteData } from '../utils';

// TODO do these types belong here?
export type PaletteColor = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

export interface PaletteColors {
  [key: number]: PaletteColor;
}

export interface PalettesApiData {
  p: PaletteColors;
  m: number;
}

interface PaletteBackgrounds {
  [id: number]: string;
}

export interface PaletteWithBackground {
  id: number;
  name: string;
  background: string;
}

export interface PaletteWithoutBackground {
  id: number;
  name: string;
}

const NONE_SELECTED = -1;

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesService extends UnsubscriberService {
  private sortedPalettes!: PaletteWithBackground[];
  private filteredPalettes$: BehaviorSubject<PaletteWithBackground[]>;
  private selectedPalette$: BehaviorSubject<PaletteWithoutBackground>;
  private backgrounds: PaletteBackgrounds = {};
  private filterTextLowercase!: string;

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private colorSlotsService: ColorSlotsService,
    private route: ActivatedRoute,
  ) {
    super();

    this.backgrounds = this.generatePaletteBackgrounds();

    this.filteredPalettes$ = new BehaviorSubject<PaletteWithBackground[]>([]);
    this.selectedPalette$ = new BehaviorSubject({
      id: NONE_SELECTED,
      name: this.getPaletteName(NONE_SELECTED),
    });

    this.appStateService.getPalettes(this.ngUnsubscribe)
      .subscribe(palettes => {
        this.sortedPalettes = this.sortPalettes(palettes);
        this.triggerUIRefresh();
      });

    this.appStateService.getState(this.ngUnsubscribe)
      .subscribe(({ mainSegmentId, segments }: AppState) => {
        const selectedSegment = segments[mainSegmentId];
        const currentPalette = selectedSegment.pal;
        this.setPalette(currentPalette as number);
      });

    // update palettes that use color slots
    this.handleUnsubscribe(this.colorSlotsService.getSelectedColor$())
      .subscribe(() => {
        this.triggerUIRefresh();
      });
  }

  setPalette(paletteId: number) {
    const selectedPaletteName = this.getPaletteName(paletteId);
    this.selectedPalette$.next({
      id: paletteId,
      name: selectedPaletteName,
    });
    return paletteId !== NONE_SELECTED
      ? this.apiService.setPalette(paletteId)
      : null;
  }

  getSelectedPalette$() {
    return this.selectedPalette$;
  }

  getFilteredPalettes$() {
    return this.filteredPalettes$;
  }

  /**
   * Emits a list of all palettes whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * @param filterText 
   * @returns 
   */
  filterPalettes(filterText = '') {
    this.filterTextLowercase = filterText.toLowerCase();
    const filteredPalettes = this.sortedPalettes
      .filter((palette) => palette.name.toLowerCase().includes(this.filterTextLowercase))
      .map((palette) => {
        // TODO better way to filter the color slot based palettes?
        const isColorSlotBasedPaletteRegex = /^\* Color/;
        if (isColorSlotBasedPaletteRegex.test(palette.name)) {
          this.updateBackground(palette.id);
        }
        return {
          ...palette,
          background: this.backgrounds[palette.id],
        };
      });
    this.filteredPalettes$.next(filteredPalettes);
  }

  /** Sorts the palettes based on their names and joins with background data. */
  private sortPalettes(paletteNames: string[]) {
    const createPalette = (id: number, name: string): PaletteWithBackground => ({
      id,
      name,
      background: '',
    });
    const sortedPalettes = paletteNames.slice(1) // remove 'Default' before sorting
      .map((name, i) => createPalette(i + 1, name));
    sortedPalettes.sort(compareNames);
    sortedPalettes.unshift(createPalette(0, 'Default'));
    return sortedPalettes;
  }

  private getPaletteName(paletteId: number) {
    let paletteName = '';
    if (paletteId !== NONE_SELECTED) {
      const selectedPalette = this.sortedPalettes
        .find(((palette) => palette.id === paletteId));
      if (selectedPalette) {
        paletteName = selectedPalette.name;
      }
    }
    return paletteName;
  }

  // TODO this logic should be done (once) in palettes data resolver
  private getPalettesData() {
    // TODO get from app state?
    const palettesData = findRouteData('palettesData', this.route) as PalettesApiData[];
    let allPalettesData: PaletteColors = {};
    for (const paletteData of palettesData) {
      allPalettesData = { ...allPalettesData, ...paletteData.p };
    }
    return allPalettesData;
  }

  private generatePaletteBackgrounds() {
    const paletteColors = this.getPalettesData();
    const backgrounds: PaletteBackgrounds = {};
    for (const id in paletteColors) {
      backgrounds[id] = this.generatePaletteBackgroundCss(paletteColors[id]);
    }
    return backgrounds;
  }

  private updateBackground(paletteId: number) {
    const paletteColors = this.getPalettesData();
    const background = this.generatePaletteBackgroundCss(paletteColors[paletteId]);
    this.backgrounds[paletteId] = background;
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
    for (let i = 0; i < paletteColor.length; i++) {
      const colorData = paletteColor[i];
      let r;
      let g;
      let b;
      const colorDataIsArray = Array.isArray(colorData);
      const percent = colorDataIsArray
        ? colorData[0] / 255 * 100
        : i / paletteColor.length * 100;
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
        // colorData = 'c1' or 'c2' or 'c3'
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

  /** Triggers a UI refresh. */
  private triggerUIRefresh() {
    this.filterPalettes(this.filterTextLowercase);
  }
}
