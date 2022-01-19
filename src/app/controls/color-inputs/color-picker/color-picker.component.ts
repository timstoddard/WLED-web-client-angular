import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import iro from '@jaames/iro';
import { UnsubscribingComponent } from '../../../shared/unsubscribing.component';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent extends UnsubscribingComponent implements OnInit, AfterViewInit {
  @Input() colorValues!: AbstractControl;
  @ViewChild('colorPicker', { read: ElementRef }) colorPickerElement!: ElementRef;
  private colorPicker!: iro.ColorPicker;

  constructor(private colorService: ColorService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.colorPicker = this.createColorPicker();
    // TODO should color picker be created/owned by color service instead?
    this.colorService.setColorPicker(this.colorPicker);
  }

  private createColorPicker() {
    // TODO why can't color be r:0/g:0/b:0?
    const colorPicker = iro.ColorPicker(this.colorPickerElement.nativeElement, {
      width: 260, // TODO make this dynamic
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelLightness: false,
            wheelAngle: 270,
            wheelDirection: 'clockwise',
          },
        },
      ],
    });

    return colorPicker;
  }
}
