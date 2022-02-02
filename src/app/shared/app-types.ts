import { WledSegment } from './api-types';

export interface AppState {
  //
}

export interface Segment extends WledSegment {
  /** Segment name (optional) */
  name?: string;
}
