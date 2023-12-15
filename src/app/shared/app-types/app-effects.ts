import { SearchableItem } from 'src/app/controls-wrapper/search-input/search-input.component';

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
  /** 0D effects (PWM & On/Off) */
  is0D: boolean;
  /** 1D effects */
  is1D: boolean;
  /** 2D effects */
  is2D: boolean;
}
