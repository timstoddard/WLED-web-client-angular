import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColorService } from '../../color.service';

const DEFAULT_R = 128;
const DEFAULT_G = 128;
const DEFAULT_B = 128;

@Component({
  selector: 'app-rgb-sliders',
  templateUrl: './rgb-sliders.component.html',
  styleUrls: ['./rgb-sliders.component.scss']
})
export class RgbSlidersComponent implements OnInit {
  rgbValues!: FormGroup;

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.rgbValues = this.createForm();
  }

  setColor() {
    this.colorService.setColorByInputType(0);
  }

  fromRgb() {
    const r = this.rgbValues.get('r')!.value as number;
    const g = this.rgbValues.get('g')!.value as number;
    const b = this.rgbValues.get('b')!.value as number;
    this.colorService.fromRgb(r, g, b);
  }

  private createForm() {
    return this.formBuilder.group({
      r: this.formBuilder.control(DEFAULT_R),
      g: this.formBuilder.control(DEFAULT_G),
      b: this.formBuilder.control(DEFAULT_B),
    });
  }
}
