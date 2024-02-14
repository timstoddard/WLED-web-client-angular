import { Injectable } from '@angular/core';
import { AppEffect, EffectDimension } from 'src/app/shared/app-types/app-effects';

export const DEFAULT_EFFECT_DATA = ';;!;1';
export const DEFAULT_EFFECT_DIMENSION = EffectDimension.ONE;

// TODO needs unit tests!!
@Injectable({ providedIn: 'root' })
export class EffectsDataService {
  /**
   * The metadata string consists of up to five sections, separated by semicolons:
   * `<Effect parameters>;<Colors>;<Palette>;<Flags>;<Defaults>`
   * 
   * Source: https://kno.wled.ge/interfaces/json-api/#effect-metadata
   * 
   * ### Effect Parameter Labels
   * 
   * Up to 5 sliders and 3 checkboxes are supported (sx,ix,c1,c2,c3,o1,o2,o3 fields in the `seg` object).
   * Slider/checkbox labels are comma separated. An empty or missing label disables this control.
   * `!` specifies the default label is used.
   * The default value (if this section is not provided) is two sliders: Effect speed and Effect intensity.
   * 
   * Parameters and default labels:
   * - sx: Speed
   * - ix: Intensity
   * - c1: Custom 1
   * - c2: Custom 2
   * - c3: Custom 3
   * - o1: Option 1
   * - o2: Option 2
   * - o3: Option 3
   * 
   * Examples:
   * - `<empty>`: No effect parameters
   * - `!`: 1 slider: Effect speed
   * - `!,!`: 1 slider: 2 sliders: Effect speed + Effect intensity
   * - `!,Phase`: 2 sliders: Effect speed + Phase
   * - `,Saturation,,,,Invert`: 1 slider (sets ix parameter) and 1 checkbox: Saturation + Invert
   * - `,,,,,Random colors`: 1 checkbox: Random colors
   * 
   * ### Colors
   * Up to 3 colors can be used.
   * Please note that only the first two characters of the label are visible in the WLED UI.
   * `!` specifies the default label is used. The default labels for the color slots are `Fx`, `Bg`, and `Cs`.
   * 
   * Examples:
   * - `<empty>`: No color controls
   * - `!`: 1 color: Fx
   * - `,!`: 1 color: Bg
   * - `!,!`: 2 colors: Fx + Bg
   * - `1,2,3`: 3 colors: 1 + 2 + 3
   * 
   * ### Palettes
   * 
   * The default value (if this section is not provided) is palette selection enabled.
   * 
   * Options:
   * - <empty>: Palette selection is disabled
   * - `!`: Palette selection is enabled
   * 
   * ### Flags
   * 
   * The default value (if this section is not provided) is 1 (a 1D optimized effect).
   * 
   * Flags allow filtering for effects with certain characteristics. They are a single character each and not comma-separated. Currently, the following flags are specified:
   * - 0: Effect works well on a single LED. If flag 0 is present, flags 1/2/3 are omitted (unused)
   * - 1: Effect is optimized for use on 1D LED strips
   * - 2: Effect requires a 2D matrix setup (unless flag 1 is also present)
   * - 3: [UNUSED] Effect requires a 3D cube (unless flags 1 and/or 2 are also present)
   * - v: Effect is audio reactive, reacts to amplitude/volume
   * - f: Effect is audio reactive, reacts to audio frequency distribution
   * 
   * Examples:
   * - `2v`: a volume reactive effect that is to be used on 2D matrices
   * 
   * ### Defaults
   * 
   * Defaults are values for effect parameters that work particularly well on that effect. They are set automatically when the effect is selected in UI unless configured otherwis in UI settings. To specify defaults, use the standard segment parameter name (e.g. `ix`) followed by an = and the default value. For example, `sx=24,pal=50` sets the effect speed to 24 (slow) and the palette to ID 50 (Aurora).
   * 
   * If no default is specified for a given parameter, it retains the current value.
   * 
   * @param id 
   * @param name 
   * @param effectData 
   * @returns 
   */
  parseEffectData(id: number, name: string, effectData: string): AppEffect | null {
    if (name.includes('RSVD')) {
      return null;
    }

    if (!effectData) {
      effectData = DEFAULT_EFFECT_DATA;
    }

    // TODO submit PR to wled github: https://github.com/Aircoookie/WLED/blob/10faaaf531e5f6eb2c00e31cba0f2ecd18ef1fd3/wled00/FX.cpp#L5183
    if (name === 'Lissajous') {
      // temporary workaround for (id=176, 'Lissajous' 'X frequency,Fade rate,,,Speed;!;!;2;;c3=15')
      effectData = 'X frequency,Fade rate,,,Speed;!;!;2;c3=15';
    }

    // Verify: this should be length 3-5
    const effectDataFields = effectData.split(';');
    if (effectDataFields.length < 3 || effectDataFields.length > 5) {
      console.warn(`Invalid effect data provided for ${name}: ${effectData}, length ${effectDataFields.length}, expected length 3-5. See https://kno.wled.ge/interfaces/json-api/#effect-metadata`);
      return null;
    }

    const parameterLabels = this.getParameterLabels(effectDataFields[0]);
    const colorLabels = this.getColorLabels(effectDataFields[1]);
    const usesPalette = effectDataFields[2] === '!';
    const apiFlags = this.getFlags(id, effectDataFields[3]);
    const segmentSettings = this.getSegmentSettings(effectDataFields[4]);

    return {
      id,
      name,
      parameterLabels,
      colorLabels,
      segmentSettings,
      usesPalette,
      usesVolume: apiFlags.includes('v'),
      usesFrequency: apiFlags.includes('f'),
      dimensions: this.getEffectDimensions(apiFlags),
      effectDataString: effectData,
    };
  }

  /**
   * Constructs the list of UI form control labels.
   * @param apiLabels label data from `fxdata` endpoint
   * @returns 
   */
  private getParameterLabels(apiLabels: string) {
    const EXPECTED_PARAMETERS_LENGTH = 8;
    const rawParameterLabels = (apiLabels || '').split(',');

    if (rawParameterLabels.length > EXPECTED_PARAMETERS_LENGTH) {
      console.warn(`Expected <= ${EXPECTED_PARAMETERS_LENGTH} parameter labels, found ${rawParameterLabels.length}: ${apiLabels}`);
    }

    // empty string label = not used
    const parameterLabels = rawParameterLabels.map((label) => label || '');
    return parameterLabels;
  }

  private getColorLabels(apiColors: string) {
    const DEFAULT_COLOR_LABELS = ['Fx', 'Bg', 'Cs'];
    const colorLabels: string[] = [];

    if (apiColors) {
      const apiColorLabels = apiColors.split(',');
      for (let i = 0; i < 3; i++) {
        if (apiColorLabels[i]) {
          colorLabels.push(apiColorLabels[i] === '!' ? DEFAULT_COLOR_LABELS[i] : apiColorLabels[i]);
        } else {
          // empty string label = not used
          colorLabels.push('');
        }
      }
    }

    return colorLabels;
  }

  private getFlags(id: number, apiFlags: string) {
    const DEFAULT_FLAGS = '1';
    // solid has no flags
    return id === 0
      ? ''
      : apiFlags || DEFAULT_FLAGS;
  }

  private getSegmentSettings(apiDefaults: string) {
    // parse default values, if any
    const defaultValueMap: { [key: string]: number } = {};
    if (apiDefaults) {
      const defaultValuePairs = apiDefaults.split(',');
      for (const keyValuePair of defaultValuePairs) {
        const [key, value] = keyValuePair.split('=');
        defaultValueMap[key] = parseInt(value, 10);
      }
    }
    return defaultValueMap;
  }

  private getEffectDimensions(flags: string) {
    const flagToDimensionMap: { [key: string]: EffectDimension } = {
      0: EffectDimension.ZERO,
      1: EffectDimension.ONE,
      2: EffectDimension.TWO,
      3: EffectDimension.THREE,
    };
    const dimensions: EffectDimension[] = [];
    for (let i = 0; i <= 3; i++) {
      if (flags.includes(`${i}`)) {
        dimensions.push(flagToDimensionMap[i]);
      }
    }
    if (dimensions.length === 0) {
      dimensions.push(DEFAULT_EFFECT_DIMENSION);
    }

    return dimensions;
  }
}
