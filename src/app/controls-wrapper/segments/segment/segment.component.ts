import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { Segment } from '../../../shared/app-types';
import { FormService } from '../../../shared/form-service';
import { UIConfigService } from '../../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../../shared/unsubscribing/unsubscribing.component';
import { formatPlural, genericPostResponse } from '../../utils';
import { SegmentsService } from '../segments.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent extends UnsubscribingComponent implements OnInit {
  @Input() segment!: Segment;
  @Input() showDeleteButton: boolean = false;
  segmentForm!: FormGroup;
  isEditingName: boolean = false;
  ledCountLabel!: string;
  useSegmentLength!: boolean;
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
  ];

  constructor(
    private segmentsService: SegmentsService,
    private formService: FormService,
    private appStateService: AppStateService,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.useSegmentLength = uiConfig.useSegmentLength;
      });

    this.segmentForm = this.createForm();
    this.updateLedCountLabel(this.segment);
  }

  selectOnlySegment() {
    this.handleUnsubscribe(
      this.segmentsService.selectOnlySegment(this.segment.id))
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
    const options = {
      segmentId: this.segment.id,
      name,
      start,
      stop,
      useSegmentLength: this.useSegmentLength,
      offset,
      grouping,
      spacing,
    };
    this.handleUnsubscribe(
      this.segmentsService.updateSegment(options))
      .subscribe(genericPostResponse(this.appStateService));
  }

  deleteSegment() {
    try {
      this.handleUnsubscribe(
        this.segmentsService.deleteSegment(this.segment.id)!)
        .subscribe(genericPostResponse(this.appStateService));
    } catch (e) { // delete failed, segments length is < 2
      // TODO show form error instead of toast (?)
      // showToast('You need to have multiple segments to delete one!');
    }
  }

  getSegmentsLength() {
    return this.segmentsService.getSegmentsLength();
  }

  onNameKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.toggleEditName();
      event.stopImmediatePropagation();
    }
  }

  private updateLedCountLabel(segment: Segment) {
    const { start, stop } = segment;
    const length = stop - (this.useSegmentLength ? 0 : start);
    const spacing = segment.spc;
    const grouping = segment.grp >= 0
      ? segment.grp
      : 1;

    let label: string;
    if (length === 0) {
      label = '(delete)';
    } else {
      label = formatPlural('LED', length);
      const virtualLeds = Math.ceil(length / (grouping + spacing));
      if (!isNaN(virtualLeds) && (grouping > 1 || spacing > 0)) {
        label += ` (${virtualLeds} virtual)`;
      }
    }
    this.ledCountLabel = label;
  }

  private toggleOn(isOn: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentOn(this.segment.id, isOn))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleSelected(isSelected: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.selectSegment(this.segment.id, isSelected))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private setBrightness(brightness: number) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentBrightness(this.segment.id, brightness))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleReverse(isReverse: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentReverse(this.segment.id, isReverse))
      .subscribe(genericPostResponse(this.appStateService));
  }

  private toggleMirror(isMirror: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentMirror(this.segment.id, isMirror))
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
    const form = this.formService.createFormGroup({
      isSelected: this.segment.sel,
      name: this.segment.name,
      isOn: this.segment.on,
      brightness: this.segment.bri,
      start: this.segment.start,
      stop: this.segment.stop,
      offset: this.segment.of,
      grouping: this.segment.grp,
      spacing: this.segment.spc,
      isReverse: this.segment.rev,
      isMirror: this.segment.mi,
    });

    // add validators
    form.get('stop')?.addValidators(this.validateStopGreaterThanStart());

    // listen to value changes
    this.getValueChanges<boolean>(form, 'isSelected')
      .subscribe((isSelected: boolean) => this.toggleSelected(isSelected));
    this.getValueChanges<boolean>(form, 'isOn')
      .subscribe((isOn: boolean) => this.toggleOn(isOn));
    this.getValueChanges<number>(form, 'brightness')
      .subscribe((brightness: number) => this.setBrightness(brightness));
    this.getValueChanges<boolean>(form, 'isReverse')
      .subscribe((isReverse: boolean) => this.toggleReverse(isReverse));
    this.getValueChanges<boolean>(form, 'isMirror')
      .subscribe((isMirror: boolean) => this.toggleMirror(isMirror));

    return form;
  }
}
