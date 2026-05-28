import { IndividualLedOverride } from 'src/app/shared/api-types/post-requests';
import { zeroPadStart } from '../utils';

export interface CustomEffectParams {
  length: number;
  iterations: number;
}

export type CustomEffect = (params: CustomEffectParams) => IndividualLedOverride[];

export class EffectUtils {
  static rgbToHex = (r: number, g: number, b: number): string => {
    const rHex = zeroPadStart(r.toString(16), 2);
    const gHex = zeroPadStart(g.toString(16), 2);
    const bHex = zeroPadStart(b.toString(16), 2);
    const hexValue = `${rHex}${gHex}${bHex}`;
    return hexValue;
  }
}
