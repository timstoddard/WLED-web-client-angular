import { IndividualLedOverride } from 'src/app/shared/api-types/post-requests';
import { CustomEffect, CustomEffectParams, EffectUtils } from './effect';

const TWO_PI = Math.PI * 2;

export class CustomEffects {
  static effect1: CustomEffect = (params: CustomEffectParams) => {
    const ledOverrides: IndividualLedOverride[] = [];
    for (let i = 0; i < params.length; i++) {
      const bool1 = params.iterations % 2 === 0;
      // const bool2 = i % 2 === 0;
      const bool2 = i % 10 < 5;
  
      const r = bool1 ? (bool2 ? 255 : 0) : (bool2 ? 0 : 255)
      const g = bool1 ? (bool2 ? 0 : 255) : (bool2 ? 255 : 0)
      const b = 0;
      const colorHex = EffectUtils.rgbToHex(r, g, b);
  
      ledOverrides.push(colorHex);
    }
    return ledOverrides;
  }
  
  static effect2: CustomEffect = (params: CustomEffectParams) => {
    const ledOverrides: IndividualLedOverride[] = [];
    for (let i = 0; i < params.length; i++) {
      const color1 = (i + params.iterations * 5) % params.length;
      const colorHex = EffectUtils.rgbToHex(255 - color1, color1, color1);
  
      ledOverrides.push(colorHex);
    }
    return ledOverrides;
  }
  
  static effect3: CustomEffect = (params: CustomEffectParams) => {
    const ledOverrides: IndividualLedOverride[] = [];
    for (let i = 0; i < params.length; i++) {
      const scalar1 = 10; // increase to make the period shorter
      const scalar2 = 20; // increase to make the motion faster
      const color1 = CustomEffects.getColorSin(i, params.length, scalar1, params.iterations, scalar2);
      const color2 = CustomEffects.getColorSin(i, params.length, scalar1, params.iterations, scalar2 * 2);
      const color3 = CustomEffects.getColorSin(i, params.length, scalar1, params.iterations, scalar2 * 4);
      ledOverrides.push(EffectUtils.rgbToHex(color1, color2, color3));
    }
    return ledOverrides;
  }

  private static getColorSin = (
    i: number,
    limit: number,
    iScalar: number,
    iterations: number,
    iterationsScalar: number,
  ) => {
    const n = ((i * iScalar) + (iterations * iterationsScalar))
    / limit;
    const color1 = Math.round((Math.sin(TWO_PI * n) + 1) * (255 / 2));
    return color1;
  }
  
  // TODO more complex effects
}
