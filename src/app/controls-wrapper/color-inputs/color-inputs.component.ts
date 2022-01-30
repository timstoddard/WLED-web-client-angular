import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { merge, takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
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
    private formBuilder: FormBuilder,
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
      this.colorService.getCurrentColorData()
        .pipe(takeUntil(this.ngUnsubscribe))
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
    this.colorInputsForm.get('colorPicker')!.get('hsvValue')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((hsvValue: number) => this.colorService.setHsvValue(hsvValue));

    this.colorInputsForm.get('colorPicker')!.get('kelvin')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((kelvin: number) => this.colorService.setKelvin(kelvin));

    const rgb = merge(
      this.colorInputsForm.get('rgb')!.get('r')!.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe)),
      this.colorInputsForm.get('rgb')!.get('g')!.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe)),
      this.colorInputsForm.get('rgb')!.get('b')!.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe)),
    );
    rgb.subscribe(() => {
      const r = this.colorInputsForm.get('rgb')!.get('r')!.value;
      const g = this.colorInputsForm.get('rgb')!.get('g')!.value;
      const b = this.colorInputsForm.get('rgb')!.get('b')!.value;
      this.colorService.setRgb(r, g, b);
    });

    this.colorInputsForm.get('whiteness')!.get('whiteChannel')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((whiteValue: number) => this.colorService.setWhiteValue(whiteValue));

    this.colorInputsForm.get('whiteness')!.get('whiteBalance')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((whiteBalance: number) => this.colorService.setWhiteBalance(whiteBalance));
  }

  /**
   * Wire up form control value listeners. Note that there is none for the `hex` form control because it should only update the internal model on submit.
   * @returns 
   */
  private createForm() {
    return this.formBuilder.group({
      colorPicker: this.formBuilder.group({
        hsvValue: this.formBuilder.control(0),
        kelvin: this.formBuilder.control(0),
      }),
      rgb: this.formBuilder.group({
        r: this.formBuilder.control(0),
        g: this.formBuilder.control(0),
        b: this.formBuilder.control(0),
      }),
      whiteness: this.formBuilder.group({
        whiteChannel: this.formBuilder.control(0),
        whiteBalance: this.formBuilder.control(0),
      }),
      hex: this.formBuilder.control(''),
    });
  }
}
