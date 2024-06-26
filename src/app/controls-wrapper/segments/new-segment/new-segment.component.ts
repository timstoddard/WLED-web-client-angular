import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { FormService } from '../../../shared/form-service';
import { UIConfigService } from '../../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { formatPlural } from '../../utils';
import { SegmentsService } from '../segments.service';

// TODO DEPRECATE AND REMOVE COMPONENT
@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.scss']
})
export class NewSegmentComponent extends UnsubscriberComponent implements OnInit {
  @Input() newSegmentId!: number;
  @Input() ledCount!: number;
  @Input() lastLed!: number;
  @Output() submit = new EventEmitter();
  newSegmentForm!: FormGroup;
  numberInputs: any[] = []; // TODO type
  ledCountLabel!: string;
  useSegmentLength!: boolean;
  private lowestUnusedId!: number;

  constructor(
    private formService: FormService,
    private segmentsService: SegmentsService,
    private uiConfigService: UIConfigService,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.useSegmentLength = uiConfig.useSegmentLength;
      });

    this.newSegmentForm = this.createForm();
    this.numberInputs = this.getNumberInputs();
    this.ledCountLabel = this.getLedCountLabel();

    // TODO get next id from segments service
    let lastLed = 0;
    if (this.lowestUnusedId > 0) {
      const segments = this.segmentsService.getSegments();
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        const a = lastSegment.stopColumn;
        const b = this.useSegmentLength
          ? lastSegment.startColumn
          : 0;
        const ledCount = a + b;
        if (ledCount < this.ledCount) {
          lastLed = ledCount;
        }
      }
    }
    this.lastLed = lastLed;

    // TODO get next available ID
    this.appStateService.getSegments(this.ngUnsubscribe)
      .subscribe(segments => {
        const maxSegmentId = segments.length;
      });
  }

  cancel() {
    // TODO this mess up the submit listeners?
    this.submit.emit();
  }

  submitForm() {
    const {
      name,
      start,
      stop,
    } = this.newSegmentForm.value;

    const options = {
      segmentId: this.newSegmentId,
      name,
      start,
      stop,
      useSegmentLength: this.useSegmentLength,
    };
    // TODO revisit this logic (move some to service?)
    this.handleUnsubscribe(
      this.segmentsService.updateSegment(options))
      .subscribe((response) => {
        this.submit.emit();
      });
  }

  private getNumberInputs() {
    // TODO use these min/max values in segment form comp
    return [
      {
        formControlName: 'start',
        label: 'Start LED',
        placeholder: '0',
        min: 0,
        max: this.ledCount - 1,
        value: this.lastLed,
      },
      {
        formControlName: 'stop',
        label: this.useSegmentLength ? 'Length' : 'Stop LED',
        placeholder: '100',
        min: 0,
        max: this.ledCount - (this.useSegmentLength ? this.lastLed : 0),
        value: this.ledCount - (this.useSegmentLength ? this.lastLed : 0),
      },
    ];
  }

  private getLedCountLabel() {
    return formatPlural('LED', this.ledCount - this.lastLed);
  }

  private createForm() {
    const defaultName = `Segment ${this.segmentsService.getSegments().length + 1}`;
    return this.formService.createFormGroup({
      name: defaultName,
      start: 0,
      // TODO move validator to shared location and use here
      stop: 0 /*, this.validateStopGreaterThanStart() */,
    });
  }
}
