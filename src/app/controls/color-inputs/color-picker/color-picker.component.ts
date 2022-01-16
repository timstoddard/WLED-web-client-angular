import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  colorValues!: FormGroup;

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.colorValues = this.createForm();
  }

  ngAfterViewInit() {
    this.colorPicker = this.createColorPicker();
    // TODO should color picker be created/owned by color service instead?
    this.colorService.setColorPicker(this.colorPicker);
  }

  fromHsvValue(value: number) {
    this.colorService.fromV(value);
  }

  fromKelvin(kelvin: number) {
    this.colorService.fromK(kelvin);
  }

  setColor() {
    this.colorService.setColorByInputType(0);
  }

  private createForm() {
    return this.formBuilder.group({
      hsvValue: this.formBuilder.control(null),
      kelvin: this.formBuilder.control(null),
    })
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

    // TODO could move this declaration into color service since we're calling its functions anyway
    colorPicker.on('input:end', () => {
      this.colorService.setColorByInputType(1);
    });
    colorPicker.on('color:change', this.colorService.updatePSliders);

    return colorPicker;
  }
}
