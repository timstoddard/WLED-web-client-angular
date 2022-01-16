import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import iro from '@jaames/iro';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, AfterViewInit {
  @ViewChild('colorPicker', { read: ElementRef }) colorPickerElement!: ElementRef;
  private colorPicker!: iro.ColorPicker;

  constructor(private colorService: ColorService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.colorPicker = this.createColorPicker();
    // TODO should color picker be created/owned by color service instead?
    this.colorService.setColorPicker(this.colorPicker);
  }

  private createColorPicker() {
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

    // TODO could move into color service since we're calling its functions anyway
    colorPicker.on('input:end', () => {
      this.colorService.setColorByInputType(1);
    });
    colorPicker.on('color:change', this.colorService.updatePSliders);

    return colorPicker;
  }
}
