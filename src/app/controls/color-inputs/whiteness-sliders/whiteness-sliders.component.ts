import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-whiteness-sliders',
  templateUrl: './whiteness-sliders.component.html',
  styleUrls: ['./whiteness-sliders.component.scss']
})
export class WhitenessSlidersComponent implements OnInit {
  @Input() whitenessSettings!: AbstractControl;

  constructor(private colorService: ColorService) {}

  ngOnInit() {
  }

  setColor(color: number) {
    // this.colorService.setColorByInputType(0);
  }

  setBalance(balance: number) {
    this.colorService.setWhiteBalance(balance);
  }
}
