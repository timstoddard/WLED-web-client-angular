import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { WledSegment } from '../../../shared/api-types';
import { UnsubscribingComponent } from '../../../shared/unsubscribing.component';
import { SegmentsService } from '../segments.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent extends UnsubscribingComponent implements OnInit {
  @Input() segment!: WledSegment;
  segmentForm!: FormGroup;
  isExpanded: boolean = false;
  isEditingName: boolean = false;
  numberInputs = [
    {
      formControlName: 'start',
      label: 'Start LED',
    },
    {
      formControlName: 'stop',
      label: 'Stop LED',
    },
    {
      formControlName: 'offset',
      label: 'Offset',
    },
    {
      formControlName: 'grouping',
      label: 'Grouping',
    },
    {
      formControlName: 'spacing',
      label: 'Spacing',
    },
  ]

  constructor(
    private segmentsService: SegmentsService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.segmentForm = this.createForm();
  }

  getSegmentName() {
    // TODO get name
    // return this.segment.n ? this.segment.n : 'Segment ' + i;
    return 'seg_name';
  }

  toggleEditName() {
    this.isEditingName = !this.isEditingName;
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  private createForm() {
    const form = this.formBuilder.group({
      isSelected: this.formBuilder.control(false),
      name: this.formBuilder.control(''),
      isOn: this.formBuilder.control(false),
      brightness: this.formBuilder.control(0),
      start: this.formBuilder.control(0),
      stop: this.formBuilder.control(0),
      offset: this.formBuilder.control(0),
      grouping: this.formBuilder.control(0),
      spacing: this.formBuilder.control(0),
      isReverse: this.formBuilder.control(false),
      isMirror: this.formBuilder.control(false),
    });

    form.get('name')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((name: string) => this.setName(name));

    form.get('isSelected')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((selected: boolean) => this.setSelected(selected));

    form.get('isOn')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((on: boolean) => this.setOn(on));

    form.get('brightness')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((brightness: number) => this.setBrightness(brightness));

    /*form.get('start')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((start: number) => this.setStart(start));

    form.get('stop')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((stop: number) => this.setStop(stop));

    form.get('offset')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((offset: number) => this.setOffset(offset));

    form.get('grouping')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((grouping: number) => this.setGrouping(grouping));

    form.get('spacing')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((spacing: number) => this.setSpacing(spacing));*/

    form.get('isReverse')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((reverse: boolean) => this.setReverse(reverse));

    form.get('isMirror')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mirror: boolean) => this.setMirror(mirror));

    return form;
  }

  private setName(name: string) {
    // TODO
  }

  private setSelected(selected: boolean) {
    // TODO
  }

  // private setExpanded(expanded: boolean) {
  //   // TODO
  // }

  private setOn(on: boolean) {
    // TODO
  }

  private setBrightness(brightness: number) {
    // TODO
  }

  private setStart(start: number) {
    // TODO
  }

  private setStop(stop: number) {
    // TODO
  }

  private setOffset(offset: number) {
    // TODO
  }

  private setGrouping(grouping: number) {
    // TODO
  }

  private setSpacing(spacing: number) {
    // TODO
  }

  private setReverse(reverse: boolean) {
    // TODO
  }

  private setMirror(mirror: boolean) {
    // TODO
  }











  private togglePower() {
    //
  }

  private updateLength() {
    //
  }

  private updateSegment() {
    // replaces setSeg
  }

  private delete() {
    //
  }

  private toggleReverse() {
    //
  }

  private toggleMirror() {
    //
  }
}
