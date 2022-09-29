import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { FormService } from '../../shared/form-service';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { ColorService, CurrentColor } from '../color.service';

@Component({
  selector: 'app-color-inputs',
  templateUrl: './color-inputs.component.html',
  styleUrls: ['./color-inputs.component.scss']
})
export class ColorInputsComponent extends UnsubscribingComponent implements OnInit, AfterViewInit {
  colorInputsForm!: FormGroup;

  constructor(
    private colorService: ColorService,
    private formSerivce: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.colorInputsForm = this.createForm();
  }

  ngAfterViewInit() {
    // using timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    // since we cannot subscribe in ngOnInit (see below comment)
    setTimeout(() => {
      // have to do this here instead of in ngOnInit so that the ColorPicker exists
      this.handleUnsubscribe(
        this.colorService.getCurrentColorData())
        .subscribe((colorData: CurrentColor) => this.populateForm(colorData));
    });
    // subscribe to valueChanges observables after setting initial value,
    // otherwise an infinite loop is created
    this.subscribeToValueChanges();
  }

  private populateForm({
    rgb,
    whiteValue,
    hex,
    hsvValue,
    kelvin,
  }: CurrentColor) {
    this.colorInputsForm.patchValue({
      colorPicker: {
        hsvValue,
        kelvin,
      },
      rgb: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
      },
      whiteness: {
        whiteChannel: whiteValue,
        // whiteBalance,
      },
      hex,
    });
  }

  private subscribeToValueChanges() {
    this.getValueChanges<number>(this.colorInputsForm, ['colorPicker', 'hsvValue'])
      .subscribe((hsvValue: number) => this.colorService.setHsvValue(hsvValue));

    this.getValueChanges<number>(this.colorInputsForm, ['colorPicker', 'kelvin'])
      .subscribe((kelvin: number) => this.colorService.setKelvin(kelvin));

    const rgb = merge(
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'r']),
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'g']),
      this.getValueChanges<number>(this.colorInputsForm, ['rgb', 'b'])
    );
    rgb.subscribe(() => {
      const r = this.colorInputsForm.get('rgb')!.get('r')!.value;
      const g = this.colorInputsForm.get('rgb')!.get('g')!.value;
      const b = this.colorInputsForm.get('rgb')!.get('b')!.value;
      this.colorService.setRgb(r, g, b);
    });

    this.getValueChanges<number>(this.colorInputsForm, ['whiteness', 'whiteChannel'])
      .subscribe((whiteValue: number) => this.colorService.setWhiteValue(whiteValue));

    this.getValueChanges<number>(this.colorInputsForm, ['whiteness', 'whiteBalance'])
      .subscribe((whiteBalance: number) => this.colorService.setWhiteBalance(whiteBalance));
  }

  /**
   * Wire up form control value listeners. Note that there is none for the `hex` form control because it should only update the internal model on submit.
   * @returns 
   */
  private createForm() {
    return this.formSerivce.createFormGroup({
      colorPicker: {
        hsvValue: 0,
        kelvin: 0,
      },
      rgb: {
        r: 0,
        g: 0,
        b: 0,
      },
      whiteness: {
        whiteChannel: 0,
        whiteBalance: 0,
      },
      hex: '',
    });
  }
}
