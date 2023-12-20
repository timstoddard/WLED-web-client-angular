import { SearchableItem } from 'src/app/controls-wrapper/search-input/search-input.component';
import { WLEDSegment } from '../api-types/api-state';

export enum EffectDimension {
  /** Represents a 0-dimensional effect. Recommended for a single pixel. */
  ZERO = 'ZERO',
  /** Represents a 1-dimensional effect. Recommended for a single LED strip. */
  ONE = 'ONE',
  /** Represents a 2-dimensional effect. Recommended for a 2D matrix of strips. */
  TWO = 'TWO',
  /** [UNUSED] Represents a 3-dimensional effect. Recommended for a 3D cube of strips. */
  THREE = 'THREE',
}

export interface AppEffect extends SearchableItem {
  /** Effect parameter labels */
  parameterLabels: string[];
  /** Effect color control labels */
  colorLabels: string[];
  /** Set specified segment fields with provided values, when the effect is selected */
  segmentSettings: { [key: string]: number };
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
   * - 3D (unused)
   */
  dimensions: EffectDimension[];
  // TODO is this really needed?
  /** Raw effect data string from API. */
  effectDataString: string;
}

export interface EffectParameterLabel {
  apiField: keyof WLEDSegment;
  label: string;
}
