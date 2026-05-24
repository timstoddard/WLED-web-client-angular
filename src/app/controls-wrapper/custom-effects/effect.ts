import { IndividualLedOverride } from 'src/app/shared/api-types/post-requests';

export interface CustomEffectParams {
  length: number;
  iterations: number;
}

export type CustomEffect = (params: CustomEffectParams) => IndividualLedOverride[];

export class EffectUtils {
  static rgbToHex = (r: number, g: number, b: number): string => {
    const rHex = EffectUtils.zeroPad(r.toString(16), 2);
    const gHex = EffectUtils.zeroPad(g.toString(16), 2);
    const bHex = EffectUtils.zeroPad(b.toString(16), 2);
    const hexValue = `${rHex}${gHex}${bHex}`;
    return hexValue;
  }

  private static zeroPad = (n: number | string, maxLength: number): string => {
    const zeroes = new Array(maxLength).fill('0').join('');
    const withZeroes = `${zeroes}${n}`;
    const zeroPadded = withZeroes.substring(withZeroes.length - maxLength, withZeroes.length);
    return zeroPadded;
  }
}