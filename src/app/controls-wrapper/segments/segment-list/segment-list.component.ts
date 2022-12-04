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
  editSegmentId!: number;

  constructor(
    private segmentsService: SegmentsService,
    private formService: FormService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
  }

  ngOnInit() {
    this.editSegmentId = -1;
    this.segmentFormGroupMap = this.createFormGroupMap();
  }

  selectOnlySegment(segmentId: number) {
    this.handleUnsubscribe(
      this.segmentsService.selectOnlySegment(segmentId))
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  toggleExpanded(segmentId: number) {
    this.segmentsService.toggleSegmentExpanded(segmentId);
  }

  onNameKeyDown(segmentId: number, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.toggleEditName(segmentId);
      event.stopImmediatePropagation();
    }
  }

  toggleEditName(segmentId: number) {
    if (segmentId === this.editSegmentId) {
      const segmentName = this.segmentFormGroupMap[segmentId].get('name')!.value as string;
      this.segmentsService.setSegmentName(segmentId, segmentName);
      this.editSegmentId = -1;
    } else {
      this.editSegmentId = segmentId;
    }
  }

  private toggleSelected(segmentId: number, isSelected: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.selectSegment(segmentId, isSelected))
      .subscribe(this.postResponseHandler.handleStateResponse());
  }

  private createFormGroupMap() {
    const formGroupMap: FormGroupMap = {};
    for (const segment of this.segments) {
      const formGroup = this.formService.createFormGroup({
        isSelected: segment.isSelected,
        name: segment.name,
      });

      this.getValueChanges<boolean>(formGroup, 'isSelected')
        .subscribe((isSelected: boolean) =>
          this.toggleSelected(segment.id, isSelected));

      formGroupMap[segment.id] = formGroup;
    }
    return formGroupMap;
  }
}
