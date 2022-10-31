import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import iro from '@jaames/iro';
import { ColorService } from '../../color.service';

const COLOR_PICKER_HEIGHT_SCALAR = 0.8;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  host: { '(window:resize)': 'onResize()' },
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('colorPicker', { read: ElementRef }) colorPickerElement!: ElementRef;
  private colorPicker!: iro.ColorPicker;

  constructor(private colorService: ColorService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.colorPicker = this.createColorPicker();
      this.colorService.setColorPicker(this.colorPicker);
    });
  }

  onResize() {
    this.colorPicker?.resize(this.getColorPickerWidth());
  }

  private createColorPicker() {
    // TODO why can't color be r:0/g:0/b:0?
    const colorPicker = iro.ColorPicker(this.colorPickerElement.nativeElement, {
      width: this.getColorPickerWidth(),
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

  private getColorPickerWidth() {
    const colorPickerNativeElement = this.colorPickerElement.nativeElement as HTMLElement;
    const containerHeight = colorPickerNativeElement.parentElement!.clientHeight;
    return containerHeight * COLOR_PICKER_HEIGHT_SCALAR;
  }
}
