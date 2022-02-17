import { WledSegment } from './api-types';

export interface AppState {
  //
}

export interface Segment extends WledSegment {
  /** Segment ID. */
  id: number;
  /** Segment name. */
  name: string;
  /** Whether or not the segment is expanded. */
  isExpanded: boolean;
}
