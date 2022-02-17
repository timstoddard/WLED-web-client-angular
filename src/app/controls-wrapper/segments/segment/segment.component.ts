import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { Segment } from '../../../shared/app-types';
import { UnsubscribingComponent } from '../../../shared/unsubscribing.component';
import { genericPostResponse } from '../../utils';
import { SegmentsService } from '../segments.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent extends UnsubscribingComponent implements OnInit {
  @Input() segment!: Segment;
  segmentForm!: FormGroup;
  isEditingName: boolean = false;
  numberInputs = [
    {
      formControlName: 'start',
      label: 'Start LED',
      placeholder: '0',
    },
    {
      formControlName: 'stop',
      label: 'Stop LED',
      placeholder: '100',
    },
    {
      formControlName: 'offset',
      label: 'Offset',
      placeholder: '0',
    },
    {
      formControlName: 'grouping',
      label: 'Grouping',
      placeholder: '1',
    },
    {
      formControlName: 'spacing',
      label: 'Spacing',
      placeholder: '0',
    },
  ]

  constructor(
    private segmentsService: SegmentsService,
    private formBuilder: FormBuilder,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.segmentForm = this.createForm();
  }

  selectOnlySegment() {
    this.segmentsService.selectOnlySegment(this.segment.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  toggleEditName() {
    this.isEditingName = !this.isEditingName;
    if (!this.isEditingName) {
      const segmentName = this.segmentForm.get('name')!.value as string;
      this.segmentsService.setSegmentName(this.segment.id, segmentName);
    }
  }

  toggleExpanded() {
    this.segmentsService.toggleSegmentExpanded(this.segment.id);
  }

  updateSegment() {
    // TODO if `stop < start` show validation error message, don't submit form
    const name = this.segmentForm.get('name')!.value as string;
    const start = this.segmentForm.get('start')!.value as number;
    const stop = this.segmentForm.get('stop')!.value as number;
    const offset = this.segmentForm.get('offset')!.value as number;
    const grouping = this.segmentForm.get('grouping')!.value as number;
    const spacing = this.segmentForm.get('spacing')!.value as number;
    this.segmentsService.updateSegment(this.segment.id, name, start, stop, offset, grouping, spacing)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  deleteSegment() {
    try {
      this.segmentsService.deleteSegment(this.segment.id)!
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(genericPostResponse(this.appStateService));
    } catch (e) { // delete failed, segments length is < 2
      // TODO show form error instead of toast (?)
      // showToast('You need to have multiple segments to delete one!');
    }
  }

  getSegmentsLength() {
    return this.segmentsService.getSegmentsLength();
  }

  private toggleOn(isOn: boolean) {
    this.segmentsService.setSegmentOn(this.segment.id, isOn)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleSelected(isSelected: boolean) {
    this.segmentsService.selectSegment(this.segment.id, isSelected)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private setBrightness(brightness: number) {
    this.segmentsService.setSegmentBrightness(this.segment.id, brightness)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleReverse(isReverse: boolean) {
    this.segmentsService.setSegmentReverse(this.segment.id, isReverse)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleMirror(isMirror: boolean) {
    this.segmentsService.setSegmentMirror(this.segment.id, isMirror)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
  }

  /** Validator: `stop` must be greater than `start`.  */
  private validateStopGreaterThanStart(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.segmentForm) {
        return null;
      }
      const start = this.segmentForm.get('start')!.value as number;
      const stop = this.segmentForm.get('stop')!.value as number;
      const error = {
        stopNotGreaterThanStart: {
          start,
          stop,
        },
      };
      return stop <= start
        ? error
        : null;
    };
  }

  private createForm() {
    const form = this.formBuilder.group({
      isSelected: this.formBuilder.control(this.segment.sel),
      name: this.formBuilder.control(this.segment.name),
      isOn: this.formBuilder.control(this.segment.on),
      brightness: this.formBuilder.control(this.segment.bri),
      start: this.formBuilder.control(this.segment.start),
      stop: this.formBuilder.control(this.segment.stop, this.validateStopGreaterThanStart()),
      offset: this.formBuilder.control(this.segment.of),
      grouping: this.formBuilder.control(this.segment.grp),
      spacing: this.formBuilder.control(this.segment.spc),
      isReverse: this.formBuilder.control(this.segment.rev),
      isMirror: this.formBuilder.control(this.segment.mi),
    });

    form.get('isSelected')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isSelected) => this.toggleSelected(isSelected));

    form.get('isOn')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isOn: boolean) => this.toggleOn(isOn));

    form.get('brightness')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((brightness: number) => this.setBrightness(brightness));

    form.get('isReverse')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isReverse: boolean) => this.toggleReverse(isReverse));

    form.get('isMirror')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMirror: boolean) => this.toggleMirror(isMirror));

    return form;
  }
}
