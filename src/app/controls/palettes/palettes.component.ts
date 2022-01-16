import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { compareNames } from '../utils';
import { PalettesService } from './palettes.service';

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss']
})
export class PalettesComponent implements OnInit {
  @Input() palettes!: any[]; // TODO type
  // @Input() palettesData!: any; // TODO type
  private selColors!: any; // TODO type
  private palettesData: any; // TODO type

  constructor(
    private palettesService: PalettesService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.palettes.shift(); //remove default
    for (let i = 0; i < this.palettes.length; i++) {
      this.palettes[i] = {
        id: i + 1,
        name: this.palettes[i],
      };
    }
    this.palettes.sort(compareNames);

    this.palettes.unshift({
      id: 0,
      name: "Default",
      class: "sticky"
    });
  }

  private genPalPrevCss(id: number, style: CSSStyleDeclaration) {
    if (!this.palettesData) {
      return;
    }
    const paletteData = this.palettesData[id];

    if (!paletteData) {
      style.display = 'none';
      return;
      // return 'display: none';
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

    style.background = `linear-gradient(to right,${gradient.join()});`;
  }

  private loadPalettesData(callback = null) {
    // TODO remove this check?
    if (this.palettesData) {
      return;
    }

    // TODO attempt to load palettes data from local storage
    const key = 'wledPalx';
    /*let palettesDataJson = this.localStorageService.get(key) as any; // TODO type
    if (palettesDataJson) {
      try {
        palettesDataJson = JSON.parse(palettesDataJson);
        const now = new Date();
        if (palettesDataJson && palettesDataJson.vid === lastinfo.vid) {
          palettesData = palettesDataJson.p;
          this.redrawPalPrev()
          if (callback) {
            callback();
          }
          return;
        }
      } catch (e) { }
    }//*/

    // TODO load palettes data, store in a field, save in local storage, update UI
    // TODO also do something with websocket connect callback
    /*this.palettesData = {};
    this.getPalettesData(0, () => {
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

  private getPalettesData(page: number, callback: () => void) {
    // const url = generateApiUrl(`json/palx?page=${page}`);
    this.palettesService.getPalettes().subscribe((json: any /* TODO type */) => {
      // if (!res.ok) {
      //   showErrorToast();
      // }
      // return res.json();
      this.palettesData = Object.assign({}, this.palettesData, json.p);
      if (page < json.m) {
        this.getPalettesData(page + 1, callback);
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

  private redrawPalPrev() {
    let palettes = document.querySelectorAll('#pallist .lstI');
    for (let i = 0; i < palettes.length; i++) {
      // TODO where does the `dataset` come from?
      let id = (palettes[i] as any).dataset.id;
      const lstPrev = palettes[i].querySelector('.lstIprev');
      if (lstPrev) {
        this.genPalPrevCss(id, (lstPrev as HTMLElement).style);
      }
    }
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
