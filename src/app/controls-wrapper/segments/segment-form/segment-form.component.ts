import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppSegment } from '../../../shared/app-types/app-state';
import { FormService, getFormControl, createGetFormControl, getFormControlFn } from '../../../shared/form-service';
import { CustomInput } from '../../../shared/text-input/text-input.component';
import { UIConfigService } from '../../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { formatPlural } from '../../utils';
import { SegmentsService } from '../segments.service';

@Component({
  selector: 'app-segment-form',
  templateUrl: './segment-form.component.html',
  styleUrls: ['./segment-form.component.scss'],
})
export class SegmentFormComponent extends UnsubscriberComponent implements OnInit {
  @Input() segment!: AppSegment;
  segmentForm!: FormGroup;
  ledCountLabel!: string;
  useSegmentLength!: boolean;
  inputs: CustomInput[] = [
    {
      label: 'Name',
      description: '',
      inputs: [
        {
          type: 'text',
          getFormControl: () => getFormControl(this.segmentForm, 'name'),
          placeholder: 'Name',
          widthPx: 120,
        },
      ],
    },
    {
      label: 'Start/Stop LED',
      description: 'The first and last LEDs to be included in this segment.',
      inputs: [
        {
          type: 'number',
          getFormControl: () => getFormControl(this.segmentForm, 'start'),
          placeholder: '0',
          widthPx: 69,
        },
        {
          type: 'number',
          getFormControl: () => getFormControl(this.segmentForm, 'stop'),
          placeholder: '100',
          widthPx: 69,
        },
      ],
    },
    {
      label: 'Offset',
      description: 'Offset before first LED.',
      inputs: [
        {
          type: 'number',
          getFormControl: () => getFormControl(this.segmentForm, 'offset'),
          placeholder: '0',
          widthPx: 69,
        },
      ],
    },
    {
      label: 'Grouping',
      description: 'The group number that includes this segment.',
      inputs: [
        {
          type: 'number',
          getFormControl: () => getFormControl(this.segmentForm, 'grouping'),
          placeholder: '1',
          widthPx: 69,
        },
      ],
    },
    {
      label: 'Spacing',
      description: 'Number of LEDs to add space around the segment.',
      inputs: [
        {
          type: 'number',
          getFormControl: () => getFormControl(this.segmentForm, 'spacing'),
          placeholder: '0',
          widthPx: 69,
        },
      ],
    },
  ];
  getFormControl!: getFormControlFn;

  constructor(
    private segmentsService: SegmentsService,
    private formService: FormService,
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
    this.getFormControl = createGetFormControl(this.segmentForm);
    this.updateLedCountLabel(this.segment);
  }

  updateSegment() {
    // TODO if `stop < start` show validation error message, don't submit form
    const name = this.segmentForm.get('name')!.value as string; // TODO save name in local storage
    const start = this.segmentForm.get('start')!.value as number;
    const stop = this.segmentForm.get('stop')!.value as number;
    const offset = this.segmentForm.get('offset')!.value as number;
    const grouping = this.segmentForm.get('grouping')!.value as number;
    const spacing = this.segmentForm.get('spacing')!.value as number;
    const options = {
      segmentId: this.segment.id,
      start,
      stop,
      useSegmentLength: this.useSegmentLength,
      offset,
      grouping,
      spacing,
    };
    this.handleUnsubscribe(
      this.segmentsService.updateSegment(options))
      .subscribe();
  }

  deleteSegment() {
    try {
      this.handleUnsubscribe(
        this.segmentsService.deleteSegment(this.segment.id)!)
        .subscribe();
    } catch (e) { // delete failed, segments length is < 2
      // TODO show form error instead of toast (?)
      // showToast('You need to have multiple segments to delete one!');
    }
  }

  getSegmentsLength() {
    return this.segmentsService.getSegments().length;
  }

  private updateLedCountLabel(segment: AppSegment) {
    const { startColumn, stopColumn } = segment;
    const length = stopColumn - (this.useSegmentLength ? 0 : startColumn);
    const spacing = segment.space;
    const grouping = segment.group >= 0
      ? segment.group
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
      .subscribe();
  }

  private setBrightness(brightness: number) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentBrightness(this.segment.id, brightness))
      .subscribe();
  }

  private toggleReverse(isReverse: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentReverse(this.segment.id, isReverse))
      .subscribe();
  }

  private toggleMirror(isMirror: boolean) {
    this.handleUnsubscribe(
      this.segmentsService.setSegmentMirror(this.segment.id, isMirror))
      .subscribe();
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
    // TODO add new fields to form
    const form = this.formService.createFormGroup({
      name: this.segment.name || '',
      isOn: this.segment.isOn,
      brightness: this.segment.brightness,
      start: this.segment.startColumn,
      stop: this.segment.stopColumn,
      offset: this.segment.startOffset,
      grouping: this.segment.group,
      spacing: this.segment.space,
      isReverse: this.segment.isHorizontallyReversed,
      isMirror: this.segment.isHorizonallyMirrored,
    });

    // add validators
    form.get('stop')!.addValidators(this.validateStopGreaterThanStart());

    // listen to value changes
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
