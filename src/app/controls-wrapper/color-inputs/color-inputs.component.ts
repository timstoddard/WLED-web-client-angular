import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { FormService } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { ColorService, CurrentColor } from '../color.service';
import { ColorSlotsService } from './color-slots/color-slots.service';

@Component({
  selector: 'app-color-inputs',
  templateUrl: './color-inputs.component.html',
  styleUrls: ['./color-inputs.component.scss']
})
export class ColorInputsComponent extends UnsubscriberComponent implements OnInit, AfterViewInit {
  colorInputsForm!: FormGroup;
  private initialColor: number[] = [];

  constructor(
    private colorService: ColorService,
    private formSerivce: FormService,
    private appStateService: AppStateService,
    private colorSlotsService: ColorSlotsService
  ) {
    super();
  }

  ngOnInit() {
    this.colorInputsForm = this.createForm();
    this.subscribeToValueChanges();

    // TODO this seems like it really belongs in the color service
    this.appStateService.getSelectedSegment(this.ngUnsubscribe)
      .subscribe(segment => {
        const colors = segment.colors;
        const selectedSlot = this.colorSlotsService.getSelectedSlot();
        this.initialColor = colors[selectedSlot];
      });
  }

  ngAfterViewInit() {
    // using timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    // since we cannot subscribe in ngOnInit (see below comment)
    setTimeout(() => {
      // have to do this here instead of in ngOnInit so that the ColorPicker exists
      this.handleUnsubscribe(
        this.colorService.getCurrentColorData())
        .subscribe((colorData: CurrentColor) => this.populateForm(colorData));

      // set initial color
      console.log('INITIAL COLOR', this.initialColor)
      this.colorService.setRgbw(
        this.initialColor[0],
        this.initialColor[1],
        this.initialColor[2],
        this.initialColor[3],
      );
    });
  }

  private populateForm({
    rgb,
    whiteChannel,
    hex,
    hsvValue,
    kelvin,
  }: CurrentColor) {
    this.colorInputsForm.patchValue({
      rgb: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
      },
      colorAndWhiteness: {
        hsvValue,
        kelvin,
        whiteChannel,
        // whiteBalance,
      },
      hex,
    },
    {
      emitEvent: false,
    });
  }

  private subscribeToValueChanges() {
    const rgb = merge(
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'r']),
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'g']),
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'b']),
    );
    this.handleUnsubscribe(rgb)
      .subscribe(() => {
        const r = this.colorInputsForm.get('rgb')!.get('r')!.value;
        const g = this.colorInputsForm.get('rgb')!.get('g')!.value;
        const b = this.colorInputsForm.get('rgb')!.get('b')!.value;
        this.colorService.setRgb(r, g, b);
      });

    this.getValueChanges<number>(this.colorInputsForm, ['colorAndWhiteness', 'hsvValue'])
      .subscribe(this.colorService.setHsvValue);
    this.getValueChanges<number>(this.colorInputsForm, ['colorAndWhiteness', 'kelvin'])
      .subscribe(this.colorService.setKelvin);
    this.getValueChanges<number>(this.colorInputsForm, ['colorAndWhiteness', 'whiteChannel'])
      .subscribe(this.colorService.setWhiteChannel);

    this.getValueChanges<number>(this.colorInputsForm, ['colorAndWhiteness', 'whiteBalance'])
      .subscribe(this.colorService.setWhiteBalance);
  }

  /**
   * Wire up form control value listeners. Note that there is none for the `hex` form control because it should only update the internal model on submit.
   * @returns 
   */
  private createForm() {
    return this.formSerivce.createFormGroup({
      rgb: {
        r: 0,
        g: 0,
        b: 0,
      },
      colorAndWhiteness: {
        hsvValue: 0,
        kelvin: 0,
        whiteChannel: 0,
        whiteBalance: 0,
      },
      hex: '',
    });
  }
}
