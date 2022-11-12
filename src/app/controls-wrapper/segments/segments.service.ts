import { Injectable } from '@angular/core';
import { ApiTypeMapper } from '../../shared/api-type-mapper';
import { WledSegment } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppSegment } from '../../shared/app-types';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class SegmentsService extends UnsubscriberService {
  private segments: AppSegment[];
  private ledCount: number = 1429; // TODO get this from api data (info.leds.count)

  constructor (
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private apiTypeMapper: ApiTypeMapper,
    private appStateService: AppStateService,
  ) {
    super();

    this.segments = [];

    this.appStateService.getSegments(this.ngUnsubscribe)
      .subscribe((segments) => {
        console.log(segments);
        this.segments = segments || [];
      });
  }

  getSegments() {
    return this.segments;
  }

  // TODO audit usages (2)
  loadApiSegments(wledSegments: WledSegment[]) {
    const segments = this.apiTypeMapper.mapWledSegmentsToAppSegments(wledSegments);
    return segments;
  }

  setSegmentName(segmentId: number, name: string) {
    const segment = this.findSegment(segmentId);

    const newName = name || this.getDefaultName(segmentId);

    // TODO call app state service
  }

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.apiService.selectSegment(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.apiService.selectOnlySegment(segmentId, this.segments.length);
  }

  selectAllSegments() {
    return this.apiService.selectAllSegments(this.segments.length);
  }

  toggleSegmentExpanded(segmentId: number) {
    const segment = this.findSegment(segmentId);
    if (segment) {
      const updatedSegments = this.segments.map(segment => {
        return segment.id === segmentId
          ? {
            ...segment,
            isExpanded: !segment.isExpanded,
          }
          : segment;
      });
      this.appStateService.setSegments(updatedSegments);
    }
  }

  createSegment(options: {
    name: string,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    // TODO add other fields?
  }) {
    return this.apiService.createSegment(options);
  }

  updateSegment(options: {
    segmentId: number,
    name: string,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) {
    return this.apiService.updateSegment(options);
  }

  deleteSegment(segmentId: number) {
    if (this.segments.length > 1) {
      return this.apiService.deleteSegment(segmentId);
    }
    return null;
    // TODO update client only fields
  }

  resetSegments() {
    return this.apiService.resetSegments(this.ledCount, this.segments.length);
    // TODO update client only fields
  }

  setSegmentOn(segmentId: number, isOn: boolean) {
    return this.apiService.setSegmentOn(segmentId, isOn);
  }

  setSegmentBrightness(segmentId: number, brightness: number) {
    return this.apiService.setSegmentBrightness(segmentId, brightness);
  }

  setSegmentReverse(segmentId: number, isReverse: boolean) {
    return this.apiService.setSegmentReverse(segmentId, isReverse);
  }

  setSegmentMirror(segmentId: number, isMirror: boolean) {
    return this.apiService.setSegmentMirror(segmentId, isMirror);
  }

  getSegmentsLength() {
    return this.segments.length;
  }

  private findSegment(segmentId: number) {
    const segment = this.segments
      .find(({ id }) => id === segmentId);
    return segment;
  }

  private loadSegmentName(segmentId: number) {
    let segmentName = this.getDefaultName(segmentId);
    try {
      const key = `SEGMENT_NAME_${segmentId}`;
      const storedSegmentName = this.localStorageService.get(key, '') as string;
      if (storedSegmentName) {
        segmentName = storedSegmentName;
      }
    } catch (e) {
      console.warn(`Segment name could not be loaded (id ${segmentId})`);
      console.error(e);
    }
    return segmentName;
  }

  private getDefaultName(segmentId: number) {
    return `Segment ${segmentId + 1}`;
  }
}
