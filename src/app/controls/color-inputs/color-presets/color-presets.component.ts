import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../color.service';

interface QuickColor {
  name: string;
  hex: string;
}

@Component({
  selector: 'app-color-presets',
  templateUrl: './color-presets.component.html',
  styleUrls: ['./color-presets.component.scss']
})
export class ColorPresetsComponent implements OnInit {
  private lasth = 0;

  quickColors: QuickColor[] = [
    // row 1
    {
      name: 'Red',
      hex: 'ff0000',
    },
    {
      name: 'Orange',
      hex: 'ffa000',
    },
    {
      name: 'Yellow',
      hex: 'ffc800',
    },
    {
      name: 'Green',
      hex: '08ff00',
    },
    {
      name: 'Cyan',
      hex: '00ffc8',
    },
    {
      name: 'Blue',
      hex: '0000ff',
    },

    // row 2
    {
      name: 'White',
      hex: 'ffffff',
    },
    {
      name: 'Warm',
      hex: 'ffe0a0',
    },
    {
      name: 'Black',
      hex: '000000',
    },
    {
      name: 'Pink',
      hex: 'ff00ff',
    },
  ];

  constructor(private colorService: ColorService) { }

  ngOnInit() {
  }

  /**
   * Set the color from a hex string. Used by quick color selectors.
   * @param hexColor 
   */
  pickColor(hexColor: string | { h: number, s: number, v: number }) {
    if (hexColor === 'rnd') {
      hexColor = this.generateRandomColor();
    }
    // TODO what are allowed color formats for picker? generateRandomColor() returns an object not a string
    this.colorService.setColorPickerColor(hexColor as unknown as string);
    this.colorService.setColorByInputType(0);
  }

  private generateRandomColor() {
    const newColor = { h: 0, s: 0, v: 100 };
    newColor.s = Math.floor((Math.random() * 50) + 50);
    do {
      newColor.h = Math.floor(Math.random() * 360);
    } while (Math.abs(newColor.h - this.lasth) < 50);
    this.lasth = newColor.h;
    return newColor;
  };
}
