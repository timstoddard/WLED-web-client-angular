import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { UIConfigService } from '../../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../../shared/unsubscribing.component';
import { formatPlural, genericPostResponse } from '../../utils';
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
    private formBuilder: FormBuilder,
    private segmentsService: SegmentsService,
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
    this.segmentsService.updateSegment(options)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.submit.emit();
        genericPostResponse(this.appStateService)(response);
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
    return this.formBuilder.group({
      name: this.formBuilder.control(defaultName),
      start: this.formBuilder.control(0),
      // TODO move validator to shared location and use here
      stop: this.formBuilder.control(0 /*, this.validateStopGreaterThanStart()*/),
    });
  }
}
