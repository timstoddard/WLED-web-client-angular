import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { compareNames } from '../utils';
import { PalettesService } from './palettes.service';

type Palette = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

interface Palettes {
  [key: number]: Palette;
}

interface PalettesData {
  p: Palettes;
  vid: number;
}

interface PaletteBackground {
  id: number;
  name: string;
  background: string;
  class?: string;
}

const DEFAULT_PALETTE_ID = 0;

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss']
})
export class PalettesComponent extends UnsubscribingComponent implements OnInit {
  // @Input() palettes: any[] = []; // TODO type
  // @Input() palettesData!: any; // TODO type
  private palettes: any[] = []; // TODO type
  private selColors!: any; // TODO type
  private palettesData: any; // TODO type
  selectedPalette!: FormControl;
  palettesWithBackgrounds: PaletteBackground[] = [];

  constructor(
    private palettesService: PalettesService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.palettes.shift(); // remove default
    for (let i = 0; i < this.palettes.length; i++) {
      this.palettes[i] = {
        id: i + 1,
        name: this.palettes[i],
      };
    }
    this.palettes.sort(compareNames);

    this.palettes.unshift({
      id: DEFAULT_PALETTE_ID,
      name: 'Default',
      class: 'sticky',
    });

    this.selectedPalette = this.createFormControl();

    this.loadPalettesData();

    this.palettesWithBackgrounds = this.generatePalettesWithBackground();
  }

  private loadPalettesData(callback: (() => void) = () => {}) { // TODO can remove callback param?
    // TODO remove this check?
    if (this.palettesData) {
      return;
    }

    this.palettesData = getPalettesData().p;

    try {
      // TODO attempt to load palettes data from local storage
      // const key = 'wledPalx';
      // let palettesDataJson = this.localStorageService.get(key) as any; // TODO type
      // palettesDataJson = JSON.parse(palettesDataJson);
      // const now = new Date();
      // const palettesDataJson = getPalettesData();
      // if (palettesDataJson /*&& palettesDataJson.vid === lastinfo.vid*/) {
      //   this.palettesData = palettesDataJson.p;
      //   // this.redrawPalPrev()
      //   callback();
      //   return;
      // }
    } catch (e) { }

    // TODO load palettes data, store in a field, save in local storage, update UI
    // TODO also do something with websocket connect callback
    /*this.palettesData = {};
    this._getPalettesData(0, () => {
      this.localStorageService.set(key, {
        p: this.palettesData,
        vid: lastinfo.vid,
      });
      this.redrawPalPrev();
      if (callback) {
        setTimeout(callback, 99); // go on to connect websocket
      }
    });//*/
  }

  private _getPalettesData(page: number, callback: () => void) {
    // const url = generateApiUrl(`json/palx?page=${page}`);
    this.palettesService.getPalettes().subscribe((json: any /* TODO type */) => {
      // if (!res.ok) {
      //   showErrorToast();
      // }
      // return res.json();
      this.palettesData = Object.assign({}, this.palettesData, json.p);
      if (page < json.m) {
        this._getPalettesData(page + 1, callback);
      } else {
        callback();
      }
    }, (error) => {
      // showToast(error, true);
      console.log(error);
    })

    // fetch(url, {
    //   method: 'get',
    //   headers: { 'Content-type': 'application/json; charset=UTF-8' }
    // })
    //   .then(res => {})
    //   .then(json => {})
    //   .catch((error) => {});
  }

  setPalette(paletteId = -1) {
    console.log(`selected palette [id=${paletteId}]`);

    // TODO update UI to show selected palette
    // if (paletteId === -1) {
    //   // called from "default" button
    //   paletteId = parseInt(document.querySelector('#pallist input[name="palette"]:checked')!.value);
    // } else {
    //   // called from a palette button
    //   document.querySelector(`#pallist input[name="palette"][value="${paletteId}`)!.checked = true;
    // }

    // TODO add selected class to selected palette
    // const selElement = document.querySelector('#pallist .selected');
    // if (selElement) {
    //   selElement.classList.remove('selected')
    // }
    // document.querySelector(`#pallist .lstI[data-id="${paletteId}"]`)!.classList.add('selected');

    // TODO api call to update
    const obj = {
      seg: { pal: paletteId },
    };
    // this.requestJson(obj);
  }

  generatePalettesWithBackground() {
    const maxPaletteId = 70; // TODO get this dynamically
    const withBackgrounds: PaletteBackground[] = [];
    for (let i = 0; i <= maxPaletteId; i++) {
      withBackgrounds.push({
        id: i,
        name: `palette id [${i}]`,
        // palette: this.palettesData[i],
        background: this.genPalPrevCss(i),
        class: '',
      });
    }
    return withBackgrounds;
  }

  /*private redrawPalPrev() {
    let palettes = document.querySelectorAll('#pallist .lstI');
    for (let i = 0; i < palettes.length; i++) {
      // TODO where does the `dataset` come from?
      let id = (palettes[i] as any).dataset.id;
      const lstPrev = palettes[i].querySelector('.lstIprev');
      if (lstPrev) {
        const backgroundGradient = this.genPalPrevCss(id);
        if (backgroundGradient && backgroundGradient.background) {
          (lstPrev as HTMLElement).style.background = backgroundGradient.background;
        }
      }
    }
  }//*/

  genPalPrevCss(id: number) {
    if (!this.palettesData) {
      // return { display: 'none' };
      return '';
    }
    const paletteData = this.palettesData[id];

    if (!paletteData) {
      // return { display: 'none' };
      return '';
    }

    // We need at least two colors for a gradient
    if (paletteData.length === 1) {
      paletteData[1] = paletteData[0];
      if (Array.isArray(paletteData[1])) {
        paletteData[1][0] = 255;
      }
    }

    const gradient = [];
    for (let j = 0; j < paletteData.length; j++) {
      const element = paletteData[j];
      let r;
      let g;
      let b;
      let index = -1;
      if (Array.isArray(element)) {
        index = element[0] / 255 * 100;
        r = element[1];
        g = element[2];
        b = element[3];
      } else if (element === 'r') {
        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;
      } else {
        if (this.selColors) {
          let pos = element[1] - 1;
          r = this.selColors[pos][0];
          g = this.selColors[pos][1];
          b = this.selColors[pos][2];
        }
      }
      if (index === -1) {
        index = j / paletteData.length * 100;
      }

      gradient.push(`rgb(${r},${g},${b}) ${index}%`);
    }

    return `linear-gradient(to right,${gradient.join()})`;
    // return {
    //   background: `linear-gradient(to right,${gradient.join()})`,
    // }
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_PALETTE_ID);
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: number) => {
        this.setPalette(value); // TODO should call palette service?
      });
    return control;
  }
}



/*const generateListItemHtml = (
  // listName: string,
  // id: number | string,
  // name: string,
  // clickAction: string,
  // extraHtml = '',
  // extraClass = '',
) => (``);

for (let i = 0; i < this.palettes.length; i++) {
  generateListItemHtml(
    'palette',
    this.palettes[i].id,
    this.palettes[i].name,
    'setPalette',
    `<div class="lstIprev" style="${this.genPalPrevCss(this.palettes[i].id)}"></div>`,
    this.palettes[i].class,
  );
}*/

const getPalettesData = (): PalettesData => {
  return { 
    p: { 
      0: [[0, 85, 0, 171], [15.9375, 132, 0, 124], [31.875, 181, 0, 75], [47.8125, 229, 0, 27], [63.75, 232, 23, 0], [79.6875, 184, 71, 0], [95.625, 171, 119, 0], [111.5625, 171, 171, 0], [127.5, 171, 85, 0], [143.4375, 221, 34, 0], [159.375, 242, 0, 14], [175.3125, 194, 0, 62], [191.25, 143, 0, 113], [207.1875, 95, 0, 161], [223.125, 47, 0, 208], [239.0625, 0, 7, 249]], 
      1: ['r', 'r', 'r', 'r'], 
      2: ['c1'], 
      3: ['c1', 'c1', 'c2', 'c2'], 
      4: ['c3', 'c2', 'c1'], 
      5: ['c1', 'c1', 'c1', 'c1', 'c1', 'c2', 'c2', 'c2', 'c2', 'c2', 'c3', 'c3', 'c3', 'c3', 'c3', 'c1'], 
      6: [[0, 85, 0, 171], [15.9375, 132, 0, 124], [31.875, 181, 0, 75], [47.8125, 229, 0, 27], [63.75, 232, 23, 0], [79.6875, 184, 71, 0], [95.625, 171, 119, 0], [111.5625, 171, 171, 0], [127.5, 171, 85, 0], [143.4375, 221, 34, 0], [159.375, 242, 0, 14], [175.3125, 194, 0, 62], [191.25, 143, 0, 113], [207.1875, 95, 0, 161], [223.125, 47, 0, 208], [239.0625, 0, 7, 249]], 
      7: [[0, 0, 0, 255], [15.9375, 0, 0, 139], [31.875, 0, 0, 139], [47.8125, 0, 0, 139], [63.75, 0, 0, 139], [79.6875, 0, 0, 139], [95.625, 0, 0, 139], [111.5625, 0, 0, 139], [127.5, 0, 0, 255], [143.4375, 0, 0, 139], [159.375, 135, 206, 235], [175.3125, 135, 206, 235], [191.25, 173, 216, 230], [207.1875, 255, 255, 255], [223.125, 173, 216, 230], [239.0625, 135, 206, 235]], 
      8: [[0, 0, 0, 0], [15.9375, 128, 0, 0], [31.875, 0, 0, 0], [47.8125, 128, 0, 0], [63.75, 139, 0, 0], [79.6875, 128, 0, 0], [95.625, 139, 0, 0], [111.5625, 139, 0, 0], [127.5, 139, 0, 0], [143.4375, 255, 0, 0], [159.375, 255, 165, 0], [175.3125, 255, 255, 255], [191.25, 255, 165, 0], [207.1875, 255, 0, 0], [223.125, 139, 0, 0], [239.0625, 0, 0, 0]], 
      9: [[0, 25, 25, 112], [15.9375, 0, 0, 139], [31.875, 25, 25, 112], [47.8125, 0, 0, 128], [63.75, 0, 0, 139], [79.6875, 0, 0, 205], [95.625, 46, 139, 87], [111.5625, 0, 128, 128], [127.5, 95, 158, 160], [143.4375, 0, 0, 255], [159.375, 0, 139, 139], [175.3125, 100, 149, 237], [191.25, 127, 255, 212], [207.1875, 46, 139, 87], [223.125, 0, 255, 255], [239.0625, 135, 206, 250]], 
      10: [[0, 0, 100, 0], [15.9375, 0, 100, 0], [31.875, 85, 107, 47], [47.8125, 0, 100, 0], [63.75, 0, 128, 0], [79.6875, 34, 139, 34], [95.625, 107, 142, 35], [111.5625, 0, 128, 0], [127.5, 46, 139, 87], [143.4375, 102, 205, 170], [159.375, 50, 205, 50], [175.3125, 154, 205, 50], [191.25, 144, 238, 144], [207.1875, 124, 252, 0], [223.125, 102, 205, 170], [239.0625, 34, 139, 34]], 
      11: [[0, 255, 0, 0], [15.9375, 213, 42, 0], [31.875, 171, 85, 0], [47.8125, 171, 127, 0], [63.75, 171, 171, 0], [79.6875, 86, 213, 0], [95.625, 0, 255, 0], [111.5625, 0, 213, 42], [127.5, 0, 171, 85], [143.4375, 0, 86, 170], [159.375, 0, 0, 255], [175.3125, 42, 0, 213], [191.25, 85, 0, 171], [207.1875, 127, 0, 129], [223.125, 171, 0, 85], [239.0625, 213, 0, 43]], 
      12: [[0, 255, 0, 0], [15.9375, 0, 0, 0], [31.875, 171, 85, 0], [47.8125, 0, 0, 0], [63.75, 171, 171, 0], [79.6875, 0, 0, 0], [95.625, 0, 255, 0], [111.5625, 0, 0, 0], [127.5, 0, 171, 85], [143.4375, 0, 0, 0], [159.375, 0, 0, 255], [175.3125, 0, 0, 0], [191.25, 85, 0, 171], [207.1875, 0, 0, 0], [223.125, 171, 0, 85], [239.0625, 0, 0, 0]], 
      13: [[0, 120, 0, 0], [22, 179, 22, 0], [51, 255, 104, 0], [85, 167, 22, 18], [135, 100, 0, 103], [198, 16, 0, 130], [255, 0, 0, 160]], 
      14: [[0, 1, 14, 5], [101, 16, 36, 14], [165, 56, 68, 30], [242, 150, 156, 99], [255, 150, 156, 99]], 
      15: [[0, 1, 6, 7], [89, 1, 99, 111], [153, 144, 209, 255], [255, 0, 73, 82]], 
      16: [[0, 4, 1, 70], [31, 55, 1, 30], [63, 255, 4, 7], [95, 59, 2, 29], [127, 11, 3, 50], [159, 39, 8, 60], [191, 112, 19, 40], [223, 78, 11, 39], [255, 29, 8, 59]], 
      17: [[0, 188, 135, 1], [255, 46, 7, 1]], 
      18: [[0, 3, 0, 255], [63, 23, 0, 255], [127, 67, 0, 255], [191, 142, 0, 45], [255, 255, 0, 0]], 
      19: [[0, 126, 11, 255], [127, 197, 1, 22], [175, 210, 157, 172], [221, 157, 3, 112], [255, 157, 3, 112]], 
      20: [[0, 10, 62, 123], [36, 56, 130, 103], [87, 153, 225, 85], [100, 199, 217, 68], [107, 255, 207, 54], [115, 247, 152, 57], [120, 239, 107, 61], [128, 247, 152, 57], [180, 255, 207, 54], [223, 255, 227, 48], [255, 255, 248, 42]], 
      21: [[0, 110, 49, 11], [29, 55, 34, 10], [68, 22, 22, 9], [68, 239, 124, 8], [97, 220, 156, 27], [124, 203, 193, 61], [178, 33, 53, 56], [255, 0, 1, 52]], 
      22: [[0, 255, 252, 214], [12, 255, 252, 214], [22, 255, 252, 214], [26, 190, 191, 115], [28, 137, 141, 52], [28, 112, 255, 205], [50, 51, 246, 214], [71, 17, 235, 226], [93, 2, 193, 199], [120, 0, 156, 174], [133, 1, 101, 115], [136, 1, 59, 71], [136, 7, 131, 170], [208, 1, 90, 151], [255, 0, 56, 133]], 
      23: [[0, 4, 1, 1], [51, 16, 0, 1], [76, 97, 104, 3], [101, 255, 131, 19], [127, 67, 9, 4], [153, 16, 0, 1], [229, 4, 1, 1], [255, 4, 1, 1]], 
      24: [[0, 8, 3, 0], [42, 23, 7, 0], [63, 75, 38, 6], [84, 169, 99, 38], [106, 213, 169, 119], [116, 255, 255, 255], [138, 135, 255, 138], [148, 22, 255, 24], [170, 0, 255, 0], [191, 0, 136, 0], [212, 0, 55, 0], [255, 0, 55, 0]], 
      25: [[0, 0, 0, 0], [37, 2, 25, 1], [76, 15, 115, 5], [127, 79, 213, 1], [128, 126, 211, 47], [130, 188, 209, 247], [153, 144, 182, 205], [204, 59, 117, 250], [255, 1, 37, 192]], 
      26: [[0, 1, 5, 0], [19, 32, 23, 1], [38, 161, 55, 1], [63, 229, 144, 1], [66, 39, 142, 74], [255, 1, 4, 1]], 
      27: [[0, 255, 33, 4], [43, 255, 68, 25], [86, 255, 7, 25], [127, 255, 82, 103], [170, 255, 255, 242], [209, 42, 255, 22], [255, 87, 255, 65]], 
      28: [[0, 247, 176, 247], [48, 255, 136, 255], [89, 220, 29, 226], [160, 7, 82, 178], [216, 1, 124, 109], [255, 1, 124, 109]], 
      29: [[0, 1, 124, 109], [66, 1, 93, 79], [104, 52, 65, 1], [130, 115, 127, 1], [150, 52, 65, 1], [201, 1, 86, 72], [239, 0, 55, 45], [255, 0, 55, 45]], 
      30: [[0, 47, 30, 2], [42, 213, 147, 24], [84, 103, 219, 52], [127, 3, 219, 207], [170, 1, 48, 214], [212, 1, 1, 111], [255, 1, 7, 33]], 
      31: [[0, 194, 1, 1], [94, 1, 29, 18], [132, 57, 131, 28], [255, 113, 1, 1]], 
      32: [[0, 2, 1, 1], [53, 18, 1, 0], [104, 69, 29, 1], [153, 167, 135, 10], [255, 46, 56, 4]], 
      33: [[0, 113, 91, 147], [72, 157, 88, 78], [89, 208, 85, 33], [107, 255, 29, 11], [141, 137, 31, 39], [255, 59, 33, 89]], 
      34: [[0, 0, 1, 255], [63, 3, 68, 45], [127, 23, 255, 0], [191, 100, 68, 1], [255, 255, 1, 4]], 
      35: [[0, 0, 0, 0], [46, 18, 0, 0], [96, 113, 0, 0], [108, 142, 3, 1], [119, 175, 17, 1], [146, 213, 44, 2], [174, 255, 82, 4], [188, 255, 115, 4], [202, 255, 156, 4], [218, 255, 203, 4], [234, 255, 255, 4], [244, 255, 255, 71], [255, 255, 255, 255]], 
      36: [[0, 0, 0, 0], [59, 0, 9, 45], [119, 0, 38, 255], [149, 3, 100, 255], [180, 23, 199, 255], [217, 100, 235, 255], [255, 255, 255, 255]], 
      37: [[0, 10, 85, 5], [25, 29, 109, 18], [60, 59, 138, 42], [93, 83, 99, 52], [106, 110, 66, 64], [109, 123, 49, 65], [113, 139, 35, 66], [116, 192, 117, 98], [124, 255, 255, 137], [168, 100, 180, 155], [255, 22, 121, 174]], 
      38: [[0, 19, 2, 39], [25, 26, 4, 45], [51, 33, 6, 52], [76, 68, 62, 125], [102, 118, 187, 240], [109, 163, 215, 247], [114, 217, 244, 255], [122, 159, 149, 221], [149, 113, 78, 188], [183, 128, 57, 155], [255, 146, 40, 123]], 
      39: [[0, 26, 1, 1], [51, 67, 4, 1], [84, 118, 14, 1], [104, 137, 152, 52], [112, 113, 65, 1], [122, 133, 149, 59], [124, 137, 152, 52], [135, 113, 65, 1], [142, 139, 154, 46], [163, 113, 13, 1], [204, 55, 3, 1], [249, 17, 1, 1], [255, 17, 1, 1]], 
      40: [[0, 0, 0, 0], [42, 0, 0, 45], [84, 0, 0, 255], [127, 42, 0, 255], [170, 255, 0, 255], [212, 255, 55, 255], [255, 255, 255, 255]], 
      41: [[0, 0, 0, 0], [63, 42, 0, 45], [127, 255, 0, 255], [191, 255, 0, 45], [255, 255, 0, 0]], 
      42: [[0, 0, 0, 0], [42, 42, 0, 0], [84, 255, 0, 0], [127, 255, 0, 45], [170, 255, 0, 255], [212, 255, 55, 45], [255, 255, 255, 0]], 
      43: [[0, 0, 0, 255], [63, 0, 55, 255], [127, 0, 255, 255], [191, 42, 255, 45], [255, 255, 255, 0]], 
      44: [[0, 0, 150, 92], [55, 0, 150, 92], [200, 255, 72, 0], [255, 255, 72, 0]], 
      45: [[0, 1, 2, 14], [33, 2, 5, 35], [100, 13, 135, 92], [120, 43, 255, 193], [140, 247, 7, 249], [160, 193, 17, 208], [180, 39, 255, 154], [200, 4, 213, 236], [220, 39, 252, 135], [240, 193, 213, 253], [255, 255, 249, 255]], 
      46: [[0, 1, 5, 45], [10, 1, 5, 45], [25, 5, 169, 175], [40, 1, 5, 45], [61, 1, 5, 45], [76, 45, 175, 31], [91, 1, 5, 45], [112, 1, 5, 45], [127, 249, 150, 5], [143, 1, 5, 45], [162, 1, 5, 45], [178, 255, 92, 0], [193, 1, 5, 45], [214, 1, 5, 45], [229, 223, 45, 72], [244, 1, 5, 45], [255, 1, 5, 45]], 
      47: [[0, 255, 95, 23], [30, 255, 82, 0], [60, 223, 13, 8], [90, 144, 44, 2], [120, 255, 110, 17], [150, 255, 69, 0], [180, 158, 13, 11], [210, 241, 82, 17], [255, 213, 37, 4]], 
      48: [[0, 184, 4, 0], [60, 184, 4, 0], [65, 144, 44, 2], [125, 144, 44, 2], [130, 4, 96, 2], [190, 4, 96, 2], [195, 7, 7, 88], [255, 7, 7, 88]], 
      49: [[0, 196, 19, 10], [65, 255, 69, 45], [130, 223, 45, 72], [195, 255, 82, 103], [255, 223, 13, 17]], 
      50: [[0, 1, 5, 45], [64, 0, 200, 23], [128, 0, 255, 0], [170, 0, 243, 45], [200, 0, 135, 7], [255, 1, 5, 45]], 
      51: [[0, 0, 28, 112], [50, 32, 96, 255], [100, 0, 243, 45], [150, 12, 95, 82], [200, 25, 190, 95], [255, 40, 170, 80]], 
      52: [[0, 6, 126, 2], [45, 6, 126, 2], [45, 4, 30, 114], [90, 4, 30, 114], [90, 255, 5, 0], [135, 255, 5, 0], [135, 196, 57, 2], [180, 196, 57, 2], [180, 137, 85, 2], [255, 137, 85, 2]], 
      53: [[0, 255, 5, 0], [60, 255, 5, 0], [60, 196, 57, 2], [120, 196, 57, 2], [120, 6, 126, 2], [180, 6, 126, 2], [180, 4, 30, 114], [255, 4, 30, 114]], 
      54: [[0, 1, 27, 105], [14, 1, 40, 127], [28, 1, 70, 168], [42, 1, 92, 197], [56, 1, 119, 221], [70, 3, 130, 151], [84, 23, 156, 149], [99, 67, 182, 112], [113, 121, 201, 52], [127, 142, 203, 11], [141, 224, 223, 1], [155, 252, 187, 2], [170, 247, 147, 1], [184, 237, 87, 1], [198, 229, 43, 1], [226, 171, 2, 2], [240, 80, 3, 3], [255, 80, 3, 3]], 
      55: [[0, 17, 177, 13], [64, 121, 242, 5], [128, 25, 173, 121], [192, 250, 77, 127], [255, 171, 101, 221]], 
      56: [[0, 227, 101, 3], [117, 194, 18, 19], [255, 92, 8, 192]], 
      57: [[0, 229, 227, 1], [15, 227, 101, 3], [142, 40, 1, 80], [198, 17, 1, 79], [255, 0, 0, 45]], 
      58: [[0, 1, 221, 53], [255, 73, 3, 178]], 
      59: [[0, 184, 1, 128], [160, 1, 193, 182], [219, 153, 227, 190], [255, 255, 255, 255]], 
      60: [[0, 0, 0, 0], [12, 1, 1, 3], [53, 8, 1, 22], [80, 4, 6, 89], [119, 2, 25, 216], [145, 7, 10, 99], [186, 15, 2, 31], [233, 2, 1, 5], [255, 0, 0, 0]], 
      61: [[0, 255, 255, 255], [45, 7, 12, 255], [112, 227, 1, 127], [112, 227, 1, 127], [140, 255, 255, 255], [155, 227, 1, 127], [196, 45, 1, 99], [255, 255, 255, 255]], 
      62: [[0, 3, 13, 43], [104, 78, 141, 240], [188, 255, 0, 0], [255, 28, 1, 1]], 
      63: [[0, 0, 0, 0], [66, 57, 227, 233], [96, 255, 255, 8], [124, 255, 255, 255], [153, 255, 255, 8], [188, 57, 227, 233], [255, 0, 0, 0]], 
      64: [[0, 4, 2, 9], [58, 16, 0, 47], [122, 24, 0, 16], [158, 144, 9, 1], [183, 179, 45, 1], [219, 220, 114, 2], [255, 234, 237, 1]], 
      65: [[0, 0, 0, 0], [9, 1, 1, 1], [40, 5, 5, 6], [66, 5, 5, 6], [101, 10, 1, 12], [255, 0, 0, 0]], 
      66: [[0, 0, 0, 0], [99, 227, 1, 1], [130, 249, 199, 95], [155, 227, 1, 1], [255, 0, 0, 0]], 
      67: [[0, 1, 1, 1], [43, 4, 1, 11], [76, 10, 1, 3], [109, 161, 4, 29], [127, 255, 86, 123], [165, 125, 16, 160], [204, 35, 13, 223], [255, 18, 2, 18]], 
      68: [[0, 31, 1, 27], [45, 34, 1, 16], [99, 137, 5, 9], [132, 213, 128, 10], [175, 199, 22, 1], [201, 199, 9, 6], [255, 1, 0, 1]], 
      69: [[0, 247, 5, 0], [28, 255, 67, 1], [43, 234, 88, 11], [58, 234, 176, 51], [84, 229, 28, 1], [114, 113, 12, 1], [140, 255, 225, 44], [168, 113, 12, 1], [196, 244, 209, 88], [216, 255, 28, 1], [255, 53, 1, 1]], 
      70: [[0, 39, 33, 34], [25, 4, 6, 15], [48, 49, 29, 22], [73, 224, 173, 1], [89, 177, 35, 5], [130, 4, 6, 15], [163, 255, 114, 6], [186, 224, 173, 1], [211, 39, 33, 34], [255, 1, 1, 1]]
    }, 
    vid: 2112080
  };
}
