import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() segment?: AppSegment;
  @Input() formType!: 'create' | 'update';
  @Input() newSegmentId!: number;
  @Input() ledCount!: number;
  @Input() lastLed!: number;
  @Output() closeForm = new EventEmitter();
  segmentForm!: FormGroup;
  ledCountLabel!: string;
  useSegmentLength!: boolean;
  inputs1!: CustomInput[];
  inputs2!: CustomInput[];
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
        this.inputs1 = this.getInputs1();
        this.inputs2 = this.getInputs2();
      });

    this.segmentForm = this.createForm();
    this.getFormControl = createGetFormControl(this.segmentForm);
    this.updateLedCountLabel();
    this.inputs1 = this.getInputs1();
    this.inputs2 = this.getInputs2();
  }

  updateSegment() {
    if (!this.segment) {
      return;
    }
    // TODO if `stop < start` show validation error message, don't submit form
    const name = this.segmentForm.get('name')!.value as string; // TODO save name in local storage
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
      .subscribe();
  }

  deleteSegment() {
    if (!this.segment) {
      return;
    }
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

  emitCloseForm() {
    this.closeForm.emit();
  }

  private getInputs1(): CustomInput[] {
    return [
      {
        label: 'Name',
        description: '',
        inputs: [
          {
            type: 'text',
            getFormControl: () => getFormControl(this.segmentForm, 'name'),
            placeholder: 'Name',
            widthPx: 150,
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
            min: 0,
            max: this.ledCount - 1,
            widthPx: 60,
          },
          {
            type: 'number',
            getFormControl: () => getFormControl(this.segmentForm, 'stop'),
            placeholder: '100',
            min: 0,
            max: this.ledCount - (this.useSegmentLength ? this.lastLed : 0),
            widthPx: 60,
          },
        ],
      },
    ];
  }

  private getInputs2(): CustomInput[] {
    return [
      {
        label: 'Offset',
        description: 'Offset before first LED.',
        inputs: [
          {
            type: 'number',
            getFormControl: () => getFormControl(this.segmentForm, 'offset'),
            placeholder: '0',
            widthPx: 60,
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
            widthPx: 60,
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
            widthPx: 60,
          },
        ],
      },
    ];
  }

  private updateLedCountLabel() {
    if (!this.segment) {
      return;
    }

    const {
      startColumn,
      stopColumn,
      space: spacing,
      group,
    } = this.segment;
    const length = stopColumn - (this.useSegmentLength ? 0 : startColumn);
    const grouping = group >= 0
      ? group
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
    if (this.segment) {
      this.handleUnsubscribe(
        this.segmentsService.setSegmentOn(this.segment.id, isOn))
        .subscribe();
    }
  }

  private setBrightness(brightness: number) {
    if (this.segment) {
      this.handleUnsubscribe(
        this.segmentsService.setSegmentBrightness(this.segment.id, brightness))
        .subscribe();
    }
  }

  private toggleReverse(isReverse: boolean) {
    if (this.segment) {
      this.handleUnsubscribe(
        this.segmentsService.setSegmentReverse(this.segment.id, isReverse))
        .subscribe();
    }
  }

  private toggleMirror(isMirror: boolean) {
    if (this.segment) {
      this.handleUnsubscribe(
        this.segmentsService.setSegmentMirror(this.segment.id, isMirror))
        .subscribe();
    }
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
        stopLessThanStart: {
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
    let formFields;
    if (this.segment) {
      formFields = {
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
      };
    } else {
      formFields = {
        name: '',
        isOn: true,
        brightness: 128,
        start: 0,
        stop: 0,
        offset: 0,
        grouping: 1,
        spacing: 0,
        isReverse: false,
        isMirror: false,
      };
    }
    const form = this.formService.createFormGroup(formFields);

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
