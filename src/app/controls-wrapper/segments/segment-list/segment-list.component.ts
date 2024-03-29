import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../shared/form-service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { SegmentsService } from '../segments.service';
import { expandFade } from '../../../shared/animations';
import { AppSegment } from '../../../shared/app-types/app-state';

@Component({
  selector: 'app-segment-list',
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.scss'],
  animations: [expandFade()],
})
export class SegmentListComponent extends UnsubscriberComponent implements OnInit {
  @Input() segments: AppSegment[] = [];
  segmentForm!: FormGroup;

  constructor(
    private segmentsService: SegmentsService,
    private formService: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.segmentForm = this.createForm();
  }

  selectOnlySegment(segmentId: number, event: Event) {
    event.stopPropagation();
    this.handleUnsubscribe(
      this.segmentsService.selectOnlySegment(segmentId))
      .subscribe();
  }

  toggleExpanded(segmentId: number) {
    this.segmentsService.toggleSegmentExpanded(segmentId);
  }

  getFormGroupBySegmentId(segmentId: number) {
    return this.segmentForm.get([segmentId])! as FormGroup;
  }

  getFormControl(segmentId: number, name: string) {
    const segmentGroup = this.segmentForm.get(`${segmentId}`) as FormGroup;
    return segmentGroup.get(name) as FormControl;
  }

  private toggleSelected(segmentId: number, isSelected: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.selectSegment(segmentId, isSelected))
      .subscribe();
  }

  private createForm() {
    const formGroup = this.formService.createFormGroup({});

    for (const segment of this.segments) {
      const childFormGroup = this.formService.createFormGroup({
        isSelected: segment.isSelected,
      });

      this.getValueChanges<boolean>(childFormGroup, 'isSelected')
        .subscribe((isSelected: boolean) =>
          this.toggleSelected(segment.id, isSelected));

      formGroup.addControl(`${segment.id}`, childFormGroup);
    }
    return formGroup;
  }
}
