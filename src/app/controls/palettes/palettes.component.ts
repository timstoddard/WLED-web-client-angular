import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { WledApiResponse } from '../../shared/api-types';
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
  m: number;
}

interface PaletteBackground {
  id: number;
  name: string;
  background: string;
}

const DEFAULT_PALETTE_ID = 0;

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss']
})
export class PalettesComponent extends UnsubscribingComponent implements OnInit {
  sortedPalettes!: PaletteBackground[];
  selectedPalette!: FormControl;
  private selColors!: any; // TODO type
  private palettesData: any; // TODO type

  constructor(
    private palettesService: PalettesService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const palettesData = this.route.snapshot.data['palettesData'] as PalettesData[];
    let allPaletesData: Palettes = {};
    for (const paletteData of palettesData) {
      allPaletesData = Object.assign(allPaletesData, paletteData.p);
    }
    this.palettesData = allPaletesData;

    const paletteNames = (this.route.snapshot.data['data'] as WledApiResponse).palettes;
    this.sortedPalettes = this.sortPalettes(paletteNames);

    this.selectedPalette = this.createFormControl();
  }

  private sortPalettes(paletteNames: string[]) {
    const backgrounds = this.generatePaletteBackgrounds(paletteNames.length);

    const sortedPalettes = paletteNames.slice(1)
      .map((name, i) => ({
        id: i + 1,
        name,
        background: backgrounds[i + 1],
      }));
    sortedPalettes.sort(compareNames);
    sortedPalettes.unshift({
      id: DEFAULT_PALETTE_ID,
      name: 'Default',
      background: backgrounds[DEFAULT_PALETTE_ID],
    });

    return sortedPalettes;
  }

  private loadPalettesData(callback: (() => void) = () => {}) { // TODO can remove callback param?
    // TODO remove this check?
    if (this.palettesData) {
      return;
    }

    // this.palettesData = getPalettesData().p;

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

  private generatePaletteBackgrounds(length: number) {
    const backgrounds: { [key: number]: string } = {};
    for (let i = 0; i < length; i++) {
      backgrounds[i] = this.genPalPrevCss(i);
    }
    return backgrounds;
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
      .subscribe((paletteId: number) => {
        this.setPalette(paletteId); // TODO should call palette service?
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
