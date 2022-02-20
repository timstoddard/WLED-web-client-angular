import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { AppUIConfig } from '../../shared/ui-config.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { Segment } from '../../shared/app-types';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { genericPostResponse, getInput } from '../utils';
import { SegmentsService } from './segments.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
})
export class SegmentsComponent extends UnsubscribingComponent implements OnInit {
  @Input() cfg!: AppUIConfig; // TODO get from service/reducer
  segments: Segment[] = [];
  noNewSegments: boolean = false;
  showDeleteButtons: boolean = false;
  showNewSegmentForm: boolean = false;
  ledCount = 0; // TODO do these belong here?
  lastLed = 0; // TODO do these belong here?
  private lowestUnusedId!: number;
  private maxSegmentId!: number;
  private maxSegments!: number;
  private confirmedResetSegments = false;

  constructor(
    private segmentsService: SegmentsService,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getLedInfo(this.ngUnsubscribe)
      .subscribe((ledInfo) => {
        this.ledCount = ledInfo.totalLeds;
        this.maxSegments = ledInfo.maxSegments;
      });

    this.segmentsService.getSegmentsStore()
      .pipe(takeUntil(this.ngUnsubscribe))
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
    this.segmentsService.selectAllSegments()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  setShowNewSegmentForm(show: boolean) {
    if (show) {
      let lastLed = 0;
      if (this.lowestUnusedId > 0) {
        const lastSegment = this.segmentsService.getLastSegment();
        const a = lastSegment.stop;
        const b = lastSegment.start;
        // TODO get app config
        // const b = this.cfg.comp.seglen
        //   ? lastSegment.start
        //   : 0;
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
          <td class="segtd">${this.cfg.comp.seglen ? "Length" : "Stop LED"}</td>
        </tr>
        <tr>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnusedId}s" type="number" min="0" max="${this.ledCount - 1}" value="${lastLed}" oninput="updateLen(${this.lowestUnusedId})"></td>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnusedId}e" type="number" min="0" max="${this.ledCount - (this.cfg.comp.seglen ? lastLed : 0)}" value="${this.ledCount - (this.cfg.comp.seglen ? lastLed : 0)}" oninput="updateLen(${this.lowestUnusedId})"></td>
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
      this.segmentsService.resetSegments()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(genericPostResponse(this.appStateService));
    }
  }
}
