import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';
import { HtmlHighlightService } from 'src/app/shared/html-highlight.service';
import { CustomIndex, OptionIndex } from 'src/app/shared/app-types/app-state';
import { DEFAULT_EFFECT_DIMENSION } from 'src/app/shared/effects-data.service';
import { SegmentApiService } from 'src/app/shared/api-service/segment-api.service';

export interface EffectMetadata {
  speed: number;
  intensity: number;
  custom1: number;
  custom2: number;
  custom3: number;
  option1: boolean;
  option2: boolean;
  option3: boolean;
}

export interface EffectFilters {
  showPalettesEffects: boolean;
  showVolumeEffects: boolean;
  showFrequencyEffects: boolean;
  show0DEffects: boolean;
  show1DEffects: boolean;
  show2DEffects: boolean;
}

export const DEFAULT_EFFECT_FILTERS: EffectFilters = {
  showPalettesEffects: false,
  showVolumeEffects: false,
  showFrequencyEffects: false,
  show0DEffects: false,
  show1DEffects: false,
  show2DEffects: false,
};

const NONE_SELECTED = -1;

@Injectable()
export class EffectsService extends UnsubscriberService {
  private effects!: AppEffect[];
  private filteredEffects$: BehaviorSubject<AppEffect[]>;
  private selectedEffect$: BehaviorSubject<AppEffect>;
  private selectedEffectMetadata$: BehaviorSubject<EffectMetadata>;
  private filterTextLowercase!: string;
  private currentEffectFilters!: EffectFilters;
  private nameToHyphenatedNameMap!: { [key: string]: string };

  constructor(
    private segmentApiService: SegmentApiService,
    private appStateService: AppStateService,
    private htmlHighlightService: HtmlHighlightService,
  ) {
    super();

    this.filteredEffects$ = new BehaviorSubject<AppEffect[]>([]);
    this.selectedEffect$ = new BehaviorSubject<AppEffect>({
      id: NONE_SELECTED,
      name: this.getEffectName(NONE_SELECTED),
      parameterLabels: [],
      colorLabels: [],
      segmentSettings: {},
      usesPalette: false,
      usesVolume: false,
      usesFrequency: false,
      dimensions: [DEFAULT_EFFECT_DIMENSION],
      effectDataString: '',
    });
    this.selectedEffectMetadata$ = new BehaviorSubject({
      speed: 0,
      intensity: 0,
      custom1: 0,
      custom2: 0,
      custom3: 0,
      option1: false,
      option2: false,
      option3: false,
    } as EffectMetadata);

    this.filterTextLowercase = '';
    this.currentEffectFilters = DEFAULT_EFFECT_FILTERS;
    this.nameToHyphenatedNameMap = this.buildNameToHyphenatedNameMap();

    this.appStateService.getEffects(this.ngUnsubscribe)
      .subscribe(effects => {
        this.effects = effects;

        // trigger UI update
        this.filterEffectsByText('');
      });

    this.appStateService.getSelectedSegment(this.ngUnsubscribe)
      .subscribe(segment => {
        if (segment) {
          this.setEffect(segment.effectId, false);
          this.selectedEffectMetadata$.next({
            speed: segment.effectSpeed,
            intensity: segment.effectIntensity,
            custom1: segment.effectCustom1,
            custom2: segment.effectCustom2,
            custom3: segment.effectCustom3,
            option1: segment.effectOption1,
            option2: segment.effectOption2,
            option3: segment.effectOption3,
          });
        }
      });
  }

  setEffect(effectId: number, shouldCallApi = true) {
    const selectedEffect = this.getEffectById(effectId);
    if (selectedEffect) {
      this.selectedEffect$.next(selectedEffect);
    }

    return (shouldCallApi && effectId !== NONE_SELECTED)
      ? this.segmentApiService.setEffect(effectId, selectedEffect?.segmentSettings)
      : null;
  }

  setSpeed(effectId: number) {
    return this.segmentApiService.setSpeed(effectId);
  }

  setIntensity(effectId: number) {
    return this.segmentApiService.setIntensity(effectId);
  }

  setCustom(index: CustomIndex, value: number) {
    return this.segmentApiService.setCustom(index, value);
  }

  setOption(index: OptionIndex, value: number) {
    return this.segmentApiService.setOption(index, value);
  }

  getSelectedEffect$() {
    return this.selectedEffect$;
  }

  getSelectedEffectMetadata$() {
    return this.selectedEffectMetadata$;
  }

  getFilteredEffects$() {
    return this.filteredEffects$;
  }

  getFilterText() {
    return this.filterTextLowercase;
  }

  getEffectFilters() {
    return this.currentEffectFilters;
  }

  getEffectById(effectId: number) {
    const effect = this.effects
      .find(((effect) => effect.id === effectId));
    return effect;
  }

  filterEffectsByText(filterText: string) {
    this.filterTextLowercase = filterText.toLowerCase();
    this.filterEffects();
  }

  filterEffectsByFilters(effectFilters: EffectFilters) {
    this.currentEffectFilters = effectFilters;
    this.filterEffects();
  }

  getHtmlFormattedEffectName(effect: AppEffect) {
    // get manually hyphenated name (hints for CSS); only exists for effects with longer names
    const hyphenatedName = this.nameToHyphenatedNameMap[effect.name];
    return this.htmlHighlightService.highlightHtmlText(
      hyphenatedName ?? effect.name,
      this.filterTextLowercase,
      // TODO add UI setting for search highlighting (high or low emphasis)
      `effectNameHighlight--${true ? 'highEmphasis' : 'lowEmphasis'}`,
      ['&shy;'],
    );
  }

  /**
   * Returns a list of all effects whose names contain `filterText` (case insensitive). When no `filterText` is provided or it is an empty string, all effects are returned.
   * Also checks that effect meets the current effect filters.
   * @param filterText 
   * @param effectFilters
   * @returns 
   */
  private filterEffects() {
    const filteredEffects = this.effects
      .filter((effect) => {
        const nameMatches = effect.name.toLowerCase().includes(this.filterTextLowercase);
        const meetFilterCondition = this.getEffectFilterCondition(effect);
        return nameMatches && meetFilterCondition;
      });
    this.filteredEffects$.next(filteredEffects);
  }

  private getEffectName(effectId: number) {
    let effectName = '';
    if (effectId !== NONE_SELECTED) {
      const selectedEffect = this.getEffectById(effectId);
      if (selectedEffect) {
        effectName = selectedEffect.name;
      }
    }
    return effectName;
  }

  private getEffectFilterCondition(effect: AppEffect) {
    const effectFilterValues = [
      {
        conditionallyShow: this.currentEffectFilters.showPalettesEffects,
        conditionValue: effect.usesPalette,
      },
      {
        conditionallyShow: this.currentEffectFilters.showVolumeEffects,
        conditionValue: effect.usesVolume,
      },
      {
        conditionallyShow: this.currentEffectFilters.showFrequencyEffects,
        conditionValue: effect.usesFrequency,
      },
      {
        conditionallyShow: this.currentEffectFilters.show0DEffects,
        conditionValue: effect.dimensions.includes(EffectDimension.ZERO),
      },
      {
        conditionallyShow: this.currentEffectFilters.show1DEffects,
        conditionValue: effect.dimensions.includes(EffectDimension.ONE),
      },
      {
        conditionallyShow: this.currentEffectFilters.show2DEffects,
        conditionValue: effect.dimensions.includes(EffectDimension.TWO),
      },
    ];

    let filterCondition = true;
    for (const { conditionallyShow, conditionValue } of effectFilterValues) {
      if (conditionallyShow) {
        filterCondition &&= conditionValue;
      }
    }
    return filterCondition;
  }

  /**
   * An unsustainable temporary solution to nicely hyphenate the long effect names,
   * since I was not able to achieve this in CSS. Closest I could get was `word-break: break-all`
   * which accounts for overflow of dynamic widths, but does not break names nicely.
   * 
   * Obviously, this does not account for any new effect names that may be added in the future.
   * It is a complete list as of: https://github.com/Aircoookie/WLED/releases/tag/v0.14.0
   * @returns 
   */
  private buildNameToHyphenatedNameMap() {
    const hyphenatedNames = [
      'Blink Rain&shy;bow',
      'Boun&shy;cing Balls',
      'Chase Rain&shy;bow',
      'Chun&shy;chun',
      'Color&shy;loop',
      'Color&shy;twinkles',
      'Color&shy;waves',
      'Dan&shy;cing Sha&shy;dows',
      'Dis&shy;solve',
      'Dis&shy;solve Rnd',
      'Distor&shy;tion Waves',
      'Dyna&shy;mic',
      'Dyna&shy;mic Smooth',
      'Fairy&shy;twinkle',
      'Fire&shy;noise',
      'Fire&shy;works',
      'Fire&shy;works 1D',
      'Fire&shy;works Star&shy;burst',
      'Freq&shy;map',
      'Freq&shy;matrix',
      'Freq&shy;pixels',
      'Freq&shy;wave',
      'Friz&shy;zles',
      'Grad&shy;ient',
      'Grav&shy;center',
      'Grav&shy;centric',
      'Grav&shy;freq',
      'Gravi&shy;meter',
      'Hallo&shy;ween Eyes',
      'Heart&shy;beat',
      'Hiph&shy;otic',
      'Jug&shy;gles',
      'Light&shy;house',
      'Light&shy;ning',
      'Lissa&shy;jous',
      'Load&shy;ing',
      'Matri&shy;pix',
      'Meta&shy;balls',
      'Mid&shy;noise',
      'Noise&shy;2D',
      'Noise&shy;fire',
      'Noise&shy;meter',
      'Noise&shy;move',
      'Octo&shy;pus',
      'Oscil&shy;late',
      'Paci&shy;fica',
      'Pal&shy;ette',
      'Per&shy;cent',
      'Pixel&shy;wave',
      'Plas&shy;moid',
      'Pop&shy;corn',
      'Pud&shy;dles',
      'Puddle&shy;peak',
      'Rail&shy;way',
      'Rain&shy;bow',
      'Rain&shy;bow Runner',
      'Ripple Rain&shy;bow',
      'Rock&shy;taves',
      'Roll&shy;ing Balls',
      'Run&shy;ning',
      'Run&shy;ning Dual',
      'Scan&shy;ner',
      'Scan&shy;ner Dual',
      'Scrol&shy;ling Text',
      'Sin&shy;dots',
      'Sine&shy;lon',
      'Sine&shy;lon Dual',
      'Sine&shy;lon Rain&shy;bow',
      'Space&shy;ships',
      'Squar&shy;ed Swirl',
      'Strobe Rain&shy;bow',
      'Sun Radi&shy;ation',
      'Sun&shy;rise',
      'Thea&shy;ter',
      'Thea&shy;ter Rain&shy;bow',
      'TV Simu&shy;lator',
      'Twinkle&shy;cat',
      'Twinkle&shy;fox',
      'Twinkle&shy;up',
      'Wash&shy;ing Mach&shy;ine',
      'Water&shy;fall',
      'Waver&shy;ly',
      'Wave&shy;sins',
    ];
    const nameToHyphenatedNameMap: { [key: string]: string } = {};
    for (const hyphenatedName of hyphenatedNames) {
      const normalizedName = hyphenatedName.replaceAll('&shy;', '');
      nameToHyphenatedNameMap[normalizedName] = hyphenatedName;
    }
    return nameToHyphenatedNameMap;
  }
}
