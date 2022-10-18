import { Component, OnInit } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { Segment } from '../../shared/app-types';
import { UnsubscriberComponent } from '../../shared/unsubscribing/unsubscriber.component';
import { SegmentsService } from './segments.service';
import { PostResponseHandler } from '../utils';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
})
export class SegmentsComponent extends UnsubscriberComponent implements OnInit {
  segments: Segment[] = [];
  noNewSegments: boolean = false;
  showDeleteButtons: boolean = false;
  showNewSegmentForm: boolean = false;
  ledCount = 0; // TODO do these belong here?
  lastLed = 0; // TODO do these belong here?
  useSegmentLength!: boolean;
  private lowestUnusedId!: number;
  private maxSegmentId!: number;
  private maxSegments!: number;
  private confirmedResetSegments = false;

  constructor(
    private segmentsService: SegmentsService,
    private appStateService: AppStateService,
    private uiConfigService: UIConfigService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getLedInfo(this.ngUnsubscribe)
      .subscribe((ledInfo) => {
        this.ledCount = ledInfo.totalLeds;
        this.maxSegments = ledInfo.maxSegments;
      });

    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.useSegmentLength = uiConfig.useSegmentLength;
      });

    this.handleUnsubscribe<any /* TODO type */>(
      this.segmentsService.getSegmentsStore())
      .subscribe((segments) => {
        this.segments = segments.ids
          .map((id: number) => segments.UIEntities[id]);
        this.maxSegmentId = this.segments.length;
        this.lowestUnusedId = this.maxSegmentId + 1;
        this.showDeleteButtons = this.segments.length >= 2;

        if (this.lowestUnusedId >= this.maxSegments) {
          this.noNewSegments = true;
        } else if (this.noNewSegments) {
          // TODO show add button
          // this.resetUtil();
          this.showNewSegmentForm = false;
          this.noNewSegments = false;
        }
      });
  }

  addSegment() {
    // TODO
  }

  deleteSegment(segmentId: number) {
    this.segmentsService.deleteSegment(segmentId);
  }

  selectAllSegments() {
    this.handleUnsubscribe(
      this.segmentsService.selectAllSegments())
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  setShowNewSegmentForm(show: boolean) {
    if (show) {
      let lastLed = 0;
      if (this.lowestUnusedId > 0) {
        // TODO this logic should be moved to new seg component
        const lastSegment = this.segmentsService.getLastSegment();
        const a = lastSegment.stop;
        const b = this.useSegmentLength
          ? lastSegment.start
          : 0;
        const ledCount = a + b;
        if (ledCount < this.ledCount) {
          lastLed = ledCount;
        }
      }
      this.lastLed = lastLed;
    }
    this.showNewSegmentForm = show;
  }

  // TODO handle adding a segment
  private makeSeg() {
    /* let cn = `
      <table class="segt">
        <tr>
          <td class="segtd">Start LED</td>
          <td class="segtd">${this.useSegmentLength ? "Length" : "Stop LED"}</td>
        </tr>
        <tr>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnusedId}s" type="number" min="0" max="${this.ledCount - 1}" value="${lastLed}" oninput="updateLen(${this.lowestUnusedId})"></td>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnusedId}e" type="number" min="0" max="${this.ledCount - (this.useSegmentLength ? lastLed : 0)}" value="${this.ledCount - (this.useSegmentLength ? lastLed : 0)}" oninput="updateLen(${this.lowestUnusedId})"></td>
        </tr>
      </table>
      <div class="h" id="seg${this.lowestUnusedId}len">
        ${this.ledCount - lastLed} LED${this.ledCount - lastLed > 1 ? "s" : ""}
      </div>`; */
  }

  getResetButtonText() {
    return this.confirmedResetSegments
      ? 'Confirm Reset'
      : 'Reset Segments';
  }

  resetSegments() {
    // TODO update background color for confirm button
    if (!this.confirmedResetSegments) {
      this.confirmedResetSegments = true;
    } else {
      this.confirmedResetSegments = false;
      this.handleUnsubscribe(
        this.segmentsService.resetSegments())
        .subscribe(this.postResponseHandler.handleFullJsonResponse());
    }
  }
}
