import { Injectable } from '@angular/core';
import { ApiTypeMapper } from '../../shared/api-type-mapper';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppSegment } from '../../shared/app-types/app-state';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';

@Injectable()
export class SegmentsService extends UnsubscriberService {
  private segments: AppSegment[];
  private ledCount: number;

  constructor (
    private apiService: ApiService,
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
    return this.apiService.segment.create({
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
    return this.apiService.segment.update(options);
  }

  deleteSegment(segmentId: number) {
    if (this.segments.length > 1) {
      return this.apiService.segment.delete(segmentId);
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
      // return this.apiService.setSegmentName(segmentId, newName);
    }
    return null;
  }

  setSegmentOn(segmentId: number, isOn: boolean) {
    return this.apiService.segment.setOn(segmentId, isOn);
  }

  setSegmentBrightness(segmentId: number, brightness: number) {
    return this.apiService.segment.setBrightness(segmentId, brightness);
  }

  setSegmentReverse(segmentId: number, isReverse: boolean) {
    return this.apiService.segment.setReverse(segmentId, isReverse);
  }

  setSegmentMirror(segmentId: number, isMirror: boolean) {
    return this.apiService.segment.setMirror(segmentId, isMirror);
  }

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.apiService.segment.select(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.apiService.segment.selectOnly(segmentId, this.segments.length);
  }

  selectAllSegments() {
    return this.apiService.segment.selectAll(this.segments.length);
  }

  resetSegments() {
    return this.apiService.segment.reset(this.ledCount, this.segments.length);
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
