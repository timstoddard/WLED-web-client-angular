import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppSegment } from '../../../shared/app-types';
import { FormService } from '../../../shared/form-service';
import { PostResponseHandler } from '../../../shared/post-response-handler';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { SegmentsService } from '../segments.service';
import { expandFade } from '../../../shared/animations';

interface FormGroupMap {
  [segmentId: number]: FormGroup;
}

@Component({
  selector: 'app-segment-list',
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.scss'],
  animations: [expandFade],
})
export class SegmentListComponent extends UnsubscriberComponent implements OnInit {
  @Input() segments: AppSegment[] = [];
  segmentFormGroupMap!: FormGroupMap;

  constructor(
    private segmentsService: SegmentsService,
    private formService: FormService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
  }

  ngOnInit() {
    this.segmentFormGroupMap = this.createFormGroupMap();
  }

  selectOnlySegment(segmentId: number, event: Event) {
    event.stopPropagation();
    this.handleUnsubscribe(
      this.segmentsService.selectOnlySegment(segmentId))
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  toggleExpanded(segmentId: number) {
    this.segmentsService.toggleSegmentExpanded(segmentId);
  }

  private toggleSelected(segmentId: number, isSelected: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.selectSegment(segmentId, isSelected))
      .subscribe(this.postResponseHandler.handleStateResponse());
  }

  // TODO simpler way to do this?
  private createFormGroupMap() {
    const formGroupMap: FormGroupMap = {};
    for (const segment of this.segments) {
      const formGroup = this.formService.createFormGroup({
        isSelected: segment.isSelected,
      });

      this.getValueChanges<boolean>(formGroup, 'isSelected')
        .subscribe((isSelected: boolean) =>
          this.toggleSelected(segment.id, isSelected));

      formGroupMap[segment.id] = formGroup;
    }
    return formGroupMap;
  }
}
