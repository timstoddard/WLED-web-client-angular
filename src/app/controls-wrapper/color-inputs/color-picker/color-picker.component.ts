import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import iro from '@jaames/iro';
import { UnsubscriberComponent } from '../../../shared/unsubscribing/unsubscriber.component';
import { ColorService } from '../../color.service';

const COLOR_PICKER_HEIGHT_SCALAR = 0.8;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  host: { '(window:resize)': 'onResize($event)' },
})
export class ColorPickerComponent extends UnsubscriberComponent implements OnInit, AfterViewInit {
  @ViewChild('colorPicker', { read: ElementRef }) colorPickerElement!: ElementRef;
  private colorPicker!: iro.ColorPicker;

  constructor(private colorService: ColorService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.colorPicker = this.createColorPicker();
      this.colorService.setColorPicker(this.colorPicker);
    });
  }

  private getColorPickerWidth() {
    const colorPickerNativeElement = this.colorPickerElement.nativeElement as HTMLElement;
    const containerHeight = colorPickerNativeElement.parentElement!.clientHeight;
    return containerHeight * COLOR_PICKER_HEIGHT_SCALAR;
  }

  onResize() {
    const colorPickerWidth = this.getColorPickerWidth();
    this.colorPicker?.resize(colorPickerWidth);
  }

  private createColorPicker() {
    const colorPickerWidth = this.getColorPickerWidth();

    // TODO why can't color be r:0/g:0/b:0?
    const colorPicker = iro.ColorPicker(this.colorPickerElement.nativeElement, {
      width: colorPickerWidth,
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
