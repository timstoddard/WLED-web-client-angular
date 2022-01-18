import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-rgb-sliders',
  templateUrl: './rgb-sliders.component.html',
  styleUrls: ['./rgb-sliders.component.scss']
})
export class RgbSlidersComponent implements OnInit {
  @Input() rgbValues!: AbstractControl;

  ngOnInit() {
  }
}
