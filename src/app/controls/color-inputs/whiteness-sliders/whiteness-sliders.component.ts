import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-whiteness-sliders',
  templateUrl: './whiteness-sliders.component.html',
  styleUrls: ['./whiteness-sliders.component.scss']
})
export class WhitenessSlidersComponent implements OnInit {
  whitenessSettings!: FormGroup;

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.whitenessSettings = this.createForm();
  }

  setColor(color: number) {
    this.colorService.setColorByInputType(0);
  }

  setBalance(balance: number) {
    this.colorService.setBalance(balance);
  }

  private createForm() {
    return this.formBuilder.group({
      whiteChannel: this.formBuilder.control(128),
      whiteBalance: this.formBuilder.control(128),
    })
  }
}
