import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { Segment } from '../../shared/app-types';
import { LocalStorageService } from '../../shared/local-storage.service';
import { ControlsServicesModule } from '../controls-services.module';
import { findRouteData } from '../utils';

@Injectable({ providedIn: ControlsServicesModule })
export class SegmentsService {
  private segments: Segment[] = [];
  private ledCount: number = 1429; // TODO get this from api data (info.leds.count)
  private expanded: boolean[] = [];

  constructor (
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
  ) {
    this.segments = this.loadSegments();
    this.expanded = this.segments.map(_ => false);
  }

  loadSegments() {
    const segments = (findRouteData('data', this.route) as WledApiResponse).state.seg;
    const formattedSegments = [];
    let i = 0;
    for (let i = 0; i < segments.length; i++) {
      const additionalFields = {
        id: i,
        name: this.loadSegmentName(i),
      };
      const withName: Segment = { ...segments[i], ...additionalFields };
      formattedSegments.push(withName);
    }
    return formattedSegments;
  }

  getSegments() {
    return this.segments;
  }

  getSegmentsLength() {
    return this.segments.length;
  }

  setSegmentName(segmentId: number, name: string) {
    if (!name) {
      name = this.getDefaultName(segmentId);
    }
    this.segments[segmentId].name = name; // TODO update via reducer
    const key = `segment-${segmentId}-name`;
    this.localStorageService.set(key, name);
  }

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.apiService.selectSegment(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.apiService.selectOnlySegment(segmentId, this.segments.length);
  }

  toggleSegmentExpanded(segmentId: number) {
    if (segmentId >= this.expanded.length) {
      console.warn(`Cannot expand segment id ${segmentId}, it does not exist.`);
      return;
    }
    this.expanded[segmentId] = !this.expanded[segmentId];
  }

  updateSegment(
    segmentId: number,
    name: string, // TODO is this really needed?
    start: number,
    stop: number,
    offset: number,
    grouping: number,
    spacing: number,
  ) {
    return this.apiService.updateSegment(segmentId, name, start, stop, offset, grouping, spacing);
  }

  deleteSegment(segmentId: number) {
    if (this.segments.length < 2) {
      // TODO show form error instead of toast (?)
      // showToast('You need to have multiple segments to delete one!');
      return;
    }
    this.expanded.splice(segmentId, 1); // remove expanded state value
    return this.apiService.deleteSegment(segmentId);
  }

  resetSegments() {
    return this.apiService.resetSegments(this.ledCount, this.segments.length);
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

  setTransitionDuration(seconds: number) {
    return this.apiService.setTransitionDuration(seconds * 10);
  }

  getSegmentExpanded(segmentId: number) {
    if (segmentId >= this.expanded.length) {
      console.warn(`Segment id ${segmentId} does not exist.`);
      return false;
    }
    return this.expanded[segmentId];
  }

  private loadSegmentName(segmentId: number) {
    let segmentName = this.getDefaultName(segmentId);
    try {
      const key = `segment-${segmentId}-name`;
      const storedSegmentName = this.localStorageService.get(key) as string;
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
