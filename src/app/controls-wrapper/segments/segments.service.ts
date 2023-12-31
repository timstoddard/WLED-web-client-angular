import { Injectable } from '@angular/core';
import { ApiTypeMapper } from '../../shared/api-type-mapper';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppSegment } from '../../shared/app-types/app-state';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { SegmentApiService } from 'src/app/shared/api-service/segment-api.service';

@Injectable()
export class SegmentsService extends UnsubscriberService {
  private segments: AppSegment[];
  private ledCount: number;

  constructor (
    private segmentApiService: SegmentApiService,
    private appStateService: AppStateService,
    private apiTypeMapper: ApiTypeMapper,
  ) {
    super();

    this.segments = [];
    this.ledCount = 0;

    this.appStateService.getSegments(this.ngUnsubscribe)
      .subscribe(segments => {
        this.segments = segments || [];
      });

    this.appStateService.getInfo(this.ngUnsubscribe)
      .subscribe(({ ledInfo }) => {
        const { totalLeds } = ledInfo;
        this.ledCount = totalLeds;
      });
  }

  getSegments() {
    return this.segments;
  }

  createSegment(options: {
    start: number,
    stop: number,
    useSegmentLength: boolean,
    // TODO add other fields?
  }) {
    const {
      nextId,
    } = this.apiTypeMapper.normalizeIds<AppSegment>(this.segments, 'id');
    return this.segmentApiService.createSegment({
      segmentId: nextId,
      ...options,
    });
  }

  updateSegment(options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) {
    return this.segmentApiService.updateSegment(options);
  }

  deleteSegment(segmentId: number) {
    if (this.segments.length > 1) {
      return this.segmentApiService.deleteSegment(segmentId);
    }
    return null;
    // TODO update client only fields
  }

  toggleSegmentExpanded(segmentId: number) {
    for (const segment of this.segments) {
      if (segment.id === segmentId) {
        segment.isExpanded = !segment.isExpanded;
        break;
      }
    }
    this.appStateService.setSegments(this.segments);
  }

  expandAll() {
    for (const segment of this.segments) {
      segment.isExpanded = true;
    }
    this.appStateService.setSegments(this.segments);
  }

  collapseAll() {
    for (const segment of this.segments) {
      segment.isExpanded = false;
    }
    this.appStateService.setSegments(this.segments);
  }

  setSegmentName(segmentId: number, name: string) {
    const segment = this.getSegmentById(segmentId);
    if (segment) {
      const newName = name || this.getDefaultName(segmentId);
      // TODO update client only field
      // return this.segmentApiService.setSegmentName(segmentId, newName);
    }
    return null;
  }

  setSegmentOn(segmentId: number, isOn: boolean) {
    return this.segmentApiService.setSegmentOn(segmentId, isOn);
  }

  setSegmentBrightness(segmentId: number, brightness: number) {
    return this.segmentApiService.setSegmentBrightness(segmentId, brightness);
  }

  setSegmentReverse(segmentId: number, isReverse: boolean) {
    return this.segmentApiService.setSegmentReverse(segmentId, isReverse);
  }

  setSegmentMirror(segmentId: number, isMirror: boolean) {
    return this.segmentApiService.setSegmentMirror(segmentId, isMirror);
  }

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.segmentApiService.selectSegment(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.segmentApiService.selectOnlySegment(segmentId, this.segments.length);
  }

  selectAllSegments() {
    return this.segmentApiService.selectAllSegments(this.segments.length);
  }

  resetSegments() {
    return this.segmentApiService.resetSegments(this.ledCount, this.segments.length);
    // TODO update client only fields
  }

  private getSegmentById(segmentId: number) {
    const segment = this.segments
      .find(({ id }) => id === segmentId);
    return segment;
  }

  private getDefaultName(segmentId: number) {
    return `Segment ${segmentId}`;
  }
}
