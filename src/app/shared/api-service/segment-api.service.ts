import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WLEDSegment } from '../api-types/api-state';
import { CustomIndex, OptionIndex } from '../app-types/app-state';

// TODO account for all currently selected segments in post requests
@Injectable({ providedIn: 'root' })
export class SegmentApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  // TODO deprecate this
  private httpPostSegment = (seg: Partial<WLEDSegment> | Array<Partial<WLEDSegment>>) => {
    return this.apiService.httpPostStateAndInfo({ seg });
  }

  // TODO how does backend api handle segments where list is incomplete but includes segment ids? are the ids respected, or is it order based, or something else?
  // TODO use this
  private httpPostSegmentV2 = (
    segmentIds: number[],
    segmentPartial: Partial<WLEDSegment>,
  ) => {
    const seg: Partial<WLEDSegment>[] = segmentIds.map((segmentId) => {
      return Object.assign({}, {
        ...segmentPartial,
        id: segmentId,
      });
    });
    return this.apiService.httpPostStateAndInfo({ seg });
  }

  /** Sets the name of the specified segment. */
  setSegmentName = (segmentId: number, name: string) => {
    return this.httpPostSegment({
      id: segmentId,
      n: name,
    });
  }

  /** Sets current palette by id. */
  setPalette = (paletteId: number) => {
    return this.httpPostSegment({
      pal: paletteId,
    });
  }

  /** Sets current effect by id, including optional metadata for defaults. */
  setEffect = (effectId: number, fields?: Partial<WLEDSegment>) => {
    const updatedSegment = Object.assign({}, fields, { fx: effectId });
    return this.httpPostSegment(updatedSegment);
  }

  /** Sets effect speed. */
  setSpeed = (speed: number) => {
    return this.httpPostSegment({
      sx: speed,
    });
  }

  /** Sets effect intensity. */
  setIntensity = (intensity: number) => {
    return this.httpPostSegment({
      ix: intensity,
    });
  }

  /** Sets one of the three custom values. */
  setCustom = (index: CustomIndex, value: number) => {
    const indexToNameMap = {
      1: 'c1',
      2: 'c2',
      3: 'c3',
    };
    const name = indexToNameMap[index];
    return this.httpPostSegment({
      [name]: value,
    });
  }

  /** Sets one of the three option values. */
  setOption = (index: OptionIndex, value: number) => {
    const indexToNameMap = {
      1: 'o1',
      2: 'o2',
      3: 'o3',
    };
    const name = indexToNameMap[index];
    return this.httpPostSegment({
      [name]: value,
    });
  }

  /**
   * Updates the current color with the rgbw values.
   * @param r Red channel
   * @param g Green channel
   * @param b Blue channel
   * @param w White channel
   * @param slot Slot to update
   */
  setColor = (
    r: number,
    g: number,
    b: number,
    w: number,
    slot: number,
  ) => {
    const colors: number[][] = [[], [], []];
    colors[slot] = [r, g, b, w];
    return this.httpPostSegment({
      col: colors,
    });
  }

  /** Sets white balance. */
  setWhiteBalance = (whiteBalance: number) => {
    return this.httpPostSegment({
      cct: whiteBalance,
    });
  }

  /** Selects the specified segment. */
  selectSegment = (segmentId: number, isSelected: boolean) => {
    return this.httpPostSegment({
      id: segmentId,
      sel: isSelected,
    });
  }

  /** Selects the specified segment and deselects all others. */
  selectOnlySegment = (segmentId: number, segmentsLength: number) => {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: i === segmentId });
    }
    return this.httpPostSegment(segments);
  }

  /** Selects all segments. */
  selectAllSegments = (segmentsLength: number) => {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: true });
    }
    return this.httpPostSegment(segments);
  }

  /** Creates a new segment. */
  createSegment = (options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
  }) => {
    const {
      segmentId,
      start,
      stop,
      useSegmentLength,
    } = options;
    const result = this.updateSegment({
      segmentId,
      start,
      stop,
      useSegmentLength,
    });
    return result;
    // TODO call api here
  }

  /** Updates the specified segment. */
  updateSegment = (options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) => {
    const calculatedStop = (options.useSegmentLength ? options.start : 0) + options.stop;
    const segment: Partial<WLEDSegment> = {
      id: options.segmentId,
      start: options.start,
      stop: calculatedStop,
    };
    if (options.offset) {
      segment.of = options.offset;
    }
    if (options.grouping) {
      segment.grp = options.grouping;
    }
    if (options.spacing) {
      segment.spc = options.spacing;
    }

    return this.httpPostSegment(segment);
  }

  /** Deletes the specified segment. */
  deleteSegment = (segmentId: number) => {
    return this.httpPostSegment({
      id: segmentId,
      stop: 0,
    });
  }

  /** Resets all segments, creating a single segment that covers the entire length of the LED strip. */
  resetSegments = (ledCount: number, segmentsLength: number) => {
    // TODO use type: Partial<WLEDSegmentPostRequest>[]
    const segments: Partial<WLEDSegment>[] = [];
    segments.push({
      start: 0,
      stop: ledCount,
      sel: true,
    });
    for (let i = 1; i < segmentsLength; i++) {
      segments.push({ stop: 0 });
    }
    return this.httpPostSegment(segments);
  }

  /** Toggles the specified segment on or off. */
  setSegmentOn = (segmentId: number, isOn: boolean) => {
    return this.httpPostSegment({
      id: segmentId,
      on: isOn,
    });
  }
  
  /** Sets the brightness of the specified segment. */
  setSegmentBrightness = (segmentId: number, brightness: number) => {
    return this.httpPostSegment({
      id: segmentId,
      bri: brightness,
    });
  }

  /** Toggles the reverse setting of the specified segment. */
  setSegmentReverse = (segmentId: number, isReverse: boolean) => {
    return this.httpPostSegment({
      id: segmentId,
      rev: isReverse,
    });
  }

  /** Toggles the mirror setting of the specified segment. */
  setSegmentMirror = (segmentId: number, isMirror: boolean) => {
    return this.httpPostSegment({
      id: segmentId,
      mi: isMirror,
    });
  }

  // !!! TODO need to add all the methods for the new segment api fields!
}
