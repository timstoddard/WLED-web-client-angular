import { Component, ElementRef, ViewChild } from '@angular/core';
import { IndividualLedOverride } from 'src/app/shared/api-types/post-requests';
import { CUSTOM_EFFECTS, LedOverrideService } from 'src/app/controls-wrapper/custom-effects/led-override.service';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';
import { FormService, getFormControl } from 'src/app/shared/form-service';
import { FormGroup } from '@angular/forms';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';

const DEFAULT_SELECTED_EFFECT_INDEX = 2;
const DEFAULT_RENDER_RATE_MS = 200;

// TODO build out this component and get it working in a performant way
// with the WLED strips
@Component({
  selector: 'app-custom-effects',
  templateUrl: './custom-effects.component.html',
  styleUrls: ['./custom-effects.component.scss']
})
export class CustomEffectsComponent extends UnsubscriberComponent {
  @ViewChild('customEffectsCanvas', { read: ElementRef }) canvas!: ElementRef<HTMLCanvasElement>;
  customEffectsForm!: FormGroup;
  CUSTOM_EFFECTS = CUSTOM_EFFECTS;

  renderRateInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.customEffectsForm, 'renderRateMs'),
    placeholder: '1000',
    widthPx: 100,
  };

  constructor(
    private formService: FormService,
    private ledOverrideService: LedOverrideService,
  ) {
    super();
  }

  ngOnInit() {
    this.customEffectsForm = this.createForm();

    this.ledOverrideService.init(DEFAULT_SELECTED_EFFECT_INDEX);

    this.handleUnsubscribe(
      this.ledOverrideService.getLedOverrides()
    ).subscribe(this.updateCanvas);
  }

  start() {
    this.ledOverrideService.start();
  }

  stop() {
    this.ledOverrideService.stop();
  }

  reset() {
    this.ledOverrideService.reset();
  }

  updateCanvas = (data: IndividualLedOverride[]) => {
    if (!this.canvas) {
      return;
    }

    const canvas = this.canvas.nativeElement.getContext('2d')!;
    const height = this.canvas.nativeElement.height;
    const width = this.canvas.nativeElement.width;
    canvas.clearRect(0, 0, width, height);

    const rectWidth = 2;
    const rectHeight = 100;
    for (let i = 0; i < data.length; i++) {
      canvas.fillStyle = this.convertDataToCssString(data[i]);
      canvas.fillRect(i * rectWidth, 0, (i + 1) * rectWidth, rectHeight);
    }
  }

  private convertDataToCssString(data: IndividualLedOverride) {
    let result: string;
    if (typeof data === 'string') {
      result = `#${data}`;
    } else {
      // TODO detect if input is not array
      // data is assumed to be in rgb array format
      const [r, g, b] = data;
      result = `rgba(${r},${g},${b},1)`;
    }
    return result;
  }

  private createForm() {
    const formGroup = this.formService.createFormGroup({
      selectedEffect: DEFAULT_SELECTED_EFFECT_INDEX,
      renderRateMs: DEFAULT_RENDER_RATE_MS,
    });

    this.getValueChanges<number>(formGroup, 'selectedEffect')
      .subscribe(value => {
        this.ledOverrideService.updateSelectedEffect(value);
      });

    this.getValueChanges<number>(formGroup, 'renderRateMs')
      .subscribe(value => {
        this.ledOverrideService.updateRenderRateMs(value);
      });

    return formGroup;
  }
}
