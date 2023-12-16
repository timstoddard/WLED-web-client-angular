import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';
import { DomSanitizer } from '@angular/platform-browser';

export interface EffectMetadata {
  speed: number;
  intensity: number;
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

export const DEFAULT_EFFECT_DATA = ';;!;1';
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
    private apiService: ApiService,
    private appStateService: AppStateService,
    private sanitizer: DomSanitizer,
  ) {
    super();

    this.filteredEffects$ = new BehaviorSubject<AppEffect[]>([]);
    this.selectedEffect$ = new BehaviorSubject<AppEffect>({
      id: NONE_SELECTED,
      name: this.getEffectName(NONE_SELECTED),
      usesPalette: false,
      usesVolume: false,
      usesFrequency: false,
      dimension: EffectDimension.ZERO,
      parameters: [],
      effectDataString: '',
    });
    this.selectedEffectMetadata$ = new BehaviorSubject({
      speed: 0,
      intensity: 0,
    });

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
      ? this.apiService.appState.effect.set(effectId)
      : null;
  }

  setSpeed(effectId: number) {
    return this.apiService.appState.speed.set(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.appState.intensity.set(effectId);
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
    // get manually hyphenated name (hints for CSS)
    const hyphenatedName = this.nameToHyphenatedNameMap[effect.name];

    // add highlighting, if there is filter text
    const unhighlightedName = hyphenatedName ?? effect.name;
    const filterText = this.getFilterText();
    if (filterText) {
      const filterTextRegExp = filterText.split('').join('(&shy;)?');
      // TODO add UI setting for search highlighting (high or low emphasis)
      const highlightEmphasis = true ? 'highEmphasis' : 'lowEmphasis';
      const rawHighlighted = unhighlightedName
          .replace(
            new RegExp(`(${filterTextRegExp})`, 'gi'),
            `<span class="effectNameHighlight--${highlightEmphasis}">$1</span>`,
          );
      return this.sanitizer.bypassSecurityTrustHtml(rawHighlighted);
    } else {
      return unhighlightedName;
    }
  }

  /** TODO finish */
  getSelectedEffectSliderLabels(effect: AppEffect) {
    // controls which sliders are shown in the effects settings
    const sliderToggles = (effect.parameters.length === 0 || effect.parameters[0] === '')
      ? []
      : effect.parameters[0].split(',');

    // TODO wire this up to color controls component
    const colorControlToggles = (effect.parameters.length < 2 || effect.parameters[1] === '')
      ? []
      : effect.parameters[1].split(',');

    // TODO wire this up to palettes component
    const paletteToggles = (effect.parameters.length < 3 || effect.parameters[2] === '')
      ? []
      : effect.parameters[2].split(',');

    console.log('sliderToggles', sliderToggles)
    console.log('colorControlToggles', colorControlToggles)
    console.log('paletteToggles', paletteToggles)

    // set sliders on/off
    const maxSliders = 5;
    const sliderLabels: string[] = [];
    for (let i = 0; i < maxSliders; i++) {
      // if (not controlDefined and for AC speed or intensity and for SR all sliders) or slider has a value
      if (
        (
          (effect.effectDataString === DEFAULT_EFFECT_DATA)
          && i < ((effect.id < 128) ? 2 : maxSliders)
        )
        || (sliderToggles.length > i && sliderToggles[i] !== '')
      ) {
        let sliderLabel = '';
        if (sliderToggles.length > i && sliderToggles[i] !== '!') {
          sliderLabel = sliderToggles[i];
        } else if (i === 0) {
          sliderLabel = 'Effect speed';
        } else if (i === 1) {
          sliderLabel = 'Effect intensity';
        } else {
          sliderLabel = 'Custom' + (i - 1);
        }

        sliderLabels.push(sliderLabel);
      }
    }
    console.log(sliderLabels)
    return sliderLabels;

    // TODO wire up this functionality
    /*if (sliderToggles.length>5) { // up to 3 checkboxes
      gId('fxopt')!.classList.remove('fade');
      for (let i = 0; i<3; i++) {
        if (5+i<sliderToggles.length && sliderToggles[5+i]!=='') {
          gId('opt'+i)!.classList.remove('hide');
          gId('optLabel'+i)!.innerHTML = sliderToggles[5+i]=="!" ? 'Option' : sliderToggles[5+i].substr(0,16);
        } else
          gId('opt'+i)!.classList.add('hide');
      }
    } else {
      gId('fxopt')!.classList.add('fade');
    }*/
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
        conditionValue: effect.dimension === EffectDimension.ZERO,
      },
      {
        conditionallyShow: this.currentEffectFilters.show1DEffects,
        conditionValue: effect.dimension === EffectDimension.ONE,
      },
      {
        conditionallyShow: this.currentEffectFilters.show2DEffects,
        conditionValue: effect.dimension === EffectDimension.TWO,
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
