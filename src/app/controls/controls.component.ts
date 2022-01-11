import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import iro from '@jaames/iro';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, AfterViewInit {
  @ViewChild('colorPicker', { read: ElementRef }) colorPicker!: ElementRef;

  // TODO copy list of quick colors from wled
  toggle: boolean = false;

  rgbaText: string = 'rgba(165, 26, 214, 0.2)';

  arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };

  selectedColor: string = 'color1';

  color1: string = '#2889e9';
  color2: string = '#e920e9';
  color3: string = '#fff500';
  color4: string = 'rgb(236,64,64)';
  color5: string = 'rgba(45,208,45,1)';
  color6: string = '#1973c0';
  color7: string = '#f200bd';
  color8: string = '#a8ff00';
  color9: string = '#278ce2';
  color10: string = '#0a6211';
  color11: string = '#f2ff00';
  color12: string = '#f200bd';
  color13: string = 'rgba(0,255,0,0.5)';
  color14: string = 'rgb(0,255,255)';
  color15: string = 'rgb(255,0,0)';
  color16: string = '#a51ad633';
  color17: string = '#666666';
  color18: string = '#fa8072';

  quickSelectStyle = {
    width: '200px',
    height: '50px',
    margin: '5px',
  };

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    const colorPicker = iro.ColorPicker(this.colorPicker.nativeElement, {
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
  }

  onEventLog(event: string, data: any) {
    console.log(event, data);
  }

  onChangeColor(color: string) {
    console.log('Color changed:', color);
  }
}
