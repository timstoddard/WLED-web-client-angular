import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppSegment } from '../../shared/app-types';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';

@Injectable()
export class SegmentsService extends UnsubscriberService {
  private segments: AppSegment[];
  private ledCount: number;

  constructor (
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();

    this.segments = [];
    this.ledCount = 0;

    this.appStateService.getSegments(this.ngUnsubscribe)
      .subscribe(segments => {
        console.log(segments);
        this.segments = segments || [];
      });

    this.appStateService.getLedInfo(this.ngUnsubscribe)
      .subscribe(({ totalLeds  }) => {
        this.ledCount = totalLeds;
      });
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

  getSegments() {
    return this.segments;
  }

  toggleSegmentExpanded(segmentId: number) {
    const segment = this.getSegmentById(segmentId);
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

  setSegmentName(segmentId: number, name: string) {
    const segment = this.getSegmentById(segmentId);
    if (segment) {
      // TODO is default name needed?
      const newName = name || this.getDefaultName(segmentId);
      return this.apiService.setSegmentName(segmentId, newName);
    }
    return null;
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

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.apiService.selectSegment(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.apiService.selectOnlySegment(segmentId, this.segments.length);
  }

  selectAllSegments() {
    return this.apiService.selectAllSegments(this.segments.length);
  }

  resetSegments() {
    return this.apiService.resetSegments(this.ledCount, this.segments.length);
    // TODO update client only fields
  }

  private getSegmentById(segmentId: number) {
    const segment = this.segments
      .find(({ id }) => id === segmentId);
    return segment;
  }

  private getDefaultName(segmentId: number) {
    return `Segment ${segmentId + 1}`;
  }
}
