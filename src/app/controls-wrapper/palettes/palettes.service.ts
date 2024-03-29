import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { ColorSlotsService } from '../color-inputs/color-slots/color-slots.service';
import { compareNames, findRouteData } from '../utils';
import { AppPalette, AppPaletteWithBackground, AppPaletteWithoutBackground } from 'src/app/shared/app-types/app-palettes';
import { WLEDPaletteColor, WLEDPaletteColors, WLEDPalettesData } from 'src/app/shared/api-types/api-palettes';
import { HtmlHighlightService } from 'src/app/shared/html-highlight.service';
import { SegmentApiService } from 'src/app/shared/api-service/segment-api.service';
import { CombinedResponse } from '../api-data.resolver';

interface PaletteBackgrounds {
  [id: number]: string;
}

const NONE_SELECTED = -1;

@Injectable()
export class PalettesService extends UnsubscriberService {
  private sortedPalettes!: AppPaletteWithBackground[];
  private filteredPalettes$: BehaviorSubject<AppPaletteWithBackground[]>;
  private selectedPalette$: BehaviorSubject<AppPaletteWithoutBackground>;
  private backgrounds: PaletteBackgrounds = {};
  private filterTextLowercase!: string;

  constructor(
    private segmentApiService: SegmentApiService,
    private appStateService: AppStateService,
    private colorSlotsService: ColorSlotsService,
    private route: ActivatedRoute,
    private htmlHighlightService: HtmlHighlightService,
  ) {
    super();

    this.backgrounds = this.generatePaletteBackgrounds();

    this.filteredPalettes$ = new BehaviorSubject<AppPaletteWithBackground[]>([]);
    this.selectedPalette$ = new BehaviorSubject({
      id: NONE_SELECTED,
      name: this.getPaletteName(NONE_SELECTED),
    });

    this.appStateService.getPalettes(this.ngUnsubscribe)
      .subscribe(palettes => {
        this.sortedPalettes = this.sortPalettes(palettes);
        this.triggerUIRefresh();
      });

    this.appStateService.getSelectedSegment(this.ngUnsubscribe)
      .subscribe(segment => {
        if (segment) {
          this.setPalette(segment.paletteId, false);
        }
      });

    // update palettes that use color slots
    this.handleUnsubscribe(this.colorSlotsService.getSelectedColor$())
      .subscribe(() => {
        this.triggerUIRefresh();
      });
  }

  setPalette(paletteId: number, shouldCallApi = true) {
    this.selectedPalette$.next({
      id: paletteId,
      name: this.getPaletteName(paletteId),
    });

    return (shouldCallApi && paletteId !== NONE_SELECTED)
      ? this.segmentApiService.setPalette(paletteId)
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

  getHtmlFormattedPaletteName(palette: AppPalette) {
    return this.htmlHighlightService.highlightHtmlText(
      palette.name,
      this.filterTextLowercase,
      // TODO add UI setting for search highlighting (high or low emphasis)
      `paletteNameHighlight--${true ? 'highEmphasis' : 'lowEmphasis'}`,
    );
  }

  /** Sorts the palettes based on their names and joins with background data. */
  private sortPalettes(paletteNames: string[]) {
    const createPalette = (id: number, name: string): AppPaletteWithBackground => ({
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

  private getPalettesData() {
    // TODO get from app state?
    const { palettesData } = (findRouteData('data', this.route) as CombinedResponse);
    return palettesData;
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

  private generatePaletteBackgroundCss(paletteColor: WLEDPaletteColor) {
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
