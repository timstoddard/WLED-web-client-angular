import { Component, OnInit } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { SegmentsService } from './segments.service';
import { PostResponseHandler } from '../../shared/post-response-handler';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
})
export class SegmentsComponent extends UnsubscriberComponent implements OnInit {
  noNewSegments: boolean = false;
  showNewSegmentForm: boolean = false;
  ledCount = 0; // TODO do these belong here?
  lastLed = 0; // TODO do these belong here?
  useSegmentLength!: boolean;
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

    // TODO refine this logic
    if (this.getSegments().length >= this.maxSegments) {
      this.noNewSegments = true;
    } else if (this.noNewSegments) {
      this.showNewSegmentForm = false;
      this.noNewSegments = false;
    }
  }

  getSegments() {
    return this.segmentsService.getSegments();
  }

  createSegment(
    start: number,
    stop: number,
    useSegmentLength: boolean,
  ) {
    const result = this.segmentsService.createSegment({
      start,
      stop,
      useSegmentLength,
    });
    this.handleUnsubscribe(result)
      .subscribe(() => {
        //
      });
  }

  deleteSegment(segmentId: number) {
    const result = this.segmentsService.deleteSegment(segmentId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(() => {
          // TODO
          console.log('segement', segmentId, 'deleted');
        });
    }
  }

  selectAllSegments() {
    this.handleUnsubscribe(
      this.segmentsService.selectAllSegments())
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  setShowNewSegmentForm(showNewSegmentForm: boolean) {
    this.showNewSegmentForm = showNewSegmentForm;
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
