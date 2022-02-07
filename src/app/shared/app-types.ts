import { WledSegment } from './api-types';

export interface AppState {
  //
}

export interface Segment extends WledSegment {
  /** Segment ID. */
  id: number;
  /** Segment name. */
  name: string;
}
