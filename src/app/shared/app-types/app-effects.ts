import { SearchableItem } from 'src/app/controls-wrapper/search-input/search-input.component';

export enum EffectDimension {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
}

export interface AppEffect extends SearchableItem {
  /** Effect ID */
  id: number;
  /** Effect name */
  name: string;
  /** effects using palette */
  usesPalette: boolean;
  /** volume effects */
  usesVolume: boolean;
  /** frequency effects */
  usesFrequency: boolean;
  /**
   * Effect dimension.
   * - 0D (PWM & On/Off)
   * - 1D
   * - 2D
   */
  dimension: EffectDimension;
}
