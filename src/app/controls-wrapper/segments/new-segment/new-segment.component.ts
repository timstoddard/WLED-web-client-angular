import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../shared/form-service';
import { UIConfigService } from '../../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../../shared/unsubscribing/unsubscribing.component';
import { formatPlural, PostResponseHandler } from '../../utils';
import { SegmentsService } from '../segments.service';

@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.scss']
})
export class NewSegmentComponent extends UnsubscribingComponent implements OnInit {
  @Input() newSegmentId!: number;
  @Input() ledCount!: number;
  @Input() lastLed!: number;
  @Output() submit = new EventEmitter();
  newSegmentForm!: FormGroup;
  numberInputs: any[] = []; // TODO type
  ledCountLabel!: string;
  useSegmentLength!: boolean;

  constructor(
    private formService: FormService,
    private segmentsService: SegmentsService,
    private uiConfigService: UIConfigService,
    private postResponseHandler: PostResponseHandler,
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
        this.postResponseHandler.handleFullJsonResponse()(response);
      });
  }

  private getNumberInputs() {
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
    const defaultName = `Segment ${this.segmentsService.getSegmentsLength() + 1}`;
    return this.formService.createFormGroup({
      name: defaultName,
      start: 0,
      // TODO move validator to shared location and use here
      stop: 0 /*, this.validateStopGreaterThanStart() */,
    });
  }
}
