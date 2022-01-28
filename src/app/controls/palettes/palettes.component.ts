import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { WledApiResponse } from '../../shared/api-types';
import { PostResponse } from '../../shared/api.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { compareNames } from '../utils';
import { PalettesService } from './palettes.service';

type PaletteColor = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

interface PaletteColors {
  [key: number]: PaletteColor;
}

interface PalettesData {
  p: PaletteColors;
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
  private selColors!: any; // TODO type // TODO where to get this from

  constructor(
    private palettesService: PalettesService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.sortedPalettes = this.getSortedPalettes();
    this.selectedPalette = this.createFormControl();
  }

  private getSortedPalettes() {
    const paletteNames = (this.route.snapshot.data['data'] as WledApiResponse).palettes;
    const backgrounds = this.generatePaletteBackgrounds();

    const sortedPalettes = paletteNames.slice(1) // remove 'Default'
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

  setPalette_old(paletteId = -1) {
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
  }

  private generatePaletteBackgrounds() {
    const paletteColors = this.getPalettesData();
    const backgrounds: { [key: number]: string } = {};
    for (const id in paletteColors) {
      backgrounds[id] = this.generatePaletteBackgroundCss(paletteColors[id]);
    }
    return backgrounds;
  }

  private getPalettesData() {
    const palettesData = this.route.snapshot.data['palettesData'] as PalettesData[];
    let allPalettesData: PaletteColors = {};
    for (const paletteData of palettesData) {
      allPalettesData = Object.assign({}, allPalettesData, paletteData.p);
    }
    return allPalettesData;
  }

  private generatePaletteBackgroundCss(paletteColor: PaletteColor) {
    if (!paletteColor || paletteColor.length === 0) {
      return '';
    }

    // need at least two colors for a gradient
    if (paletteColor.length === 1) {
      paletteColor[1] = paletteColor[0];
      if (Array.isArray(paletteColor[1])) {
        // set x position to max
        paletteColor[1][0] = 255;
      }
    }

    const gradient = [];
    for (let j = 0; j < paletteColor.length; j++) {
      const element = paletteColor[j];
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
      } else if (this.selColors) {
        // element = 'c1' or 'c2' or 'c3'
        // TODO update if # of selColors is made variable
        let pos = parseInt(element[1], 10) - 1;
        r = this.selColors[pos][0];
        g = this.selColors[pos][1];
        b = this.selColors[pos][2];
      }
      if (index === -1) {
        index = j / paletteColor.length * 100;
      }

      gradient.push(`rgb(${r},${g},${b}) ${index}%`);
    }

    return `linear-gradient(to right,${gradient.join()})`;
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_PALETTE_ID);
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((paletteId: number) => this.setPalette(paletteId));
    return control;
  }

  private setPalette(paletteId: number) {
    this.palettesService.setPalette(paletteId)
      .subscribe((response: PostResponse) => {
        if (!response.success) {
          // TODO show error toast
          alert('failed to update');
        }
      });
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
