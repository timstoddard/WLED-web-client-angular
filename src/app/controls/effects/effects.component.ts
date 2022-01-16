import { Component, Input, OnInit } from '@angular/core';
import { compareNames } from '../utils';

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss']
})
export class EffectsComponent implements OnInit {
  @Input() effects!: any[]; // TODO type

  constructor() { }

  ngOnInit() {
    this.effects.shift(); // remove solid
    for (let i = 0; i < this.effects.length; i++) {
      this.effects[i] = {
        id: i + 1,
        name: this.effects[i],
      };
    }
    this.effects.sort(compareNames);

    this.effects.unshift({
      id: 0,
      name: 'Solid',
      class: 'sticky',
    });
  }

  setX(index = -1) {
    // TODO update data model to set selected effect by `index`
    // if (index === -1) {
    //   index = parseInt(document.querySelector('#fxlist input[name="fx"]:checked')!.value);
    // } else {
    //   document.querySelector(`#fxlist input[name="fx"][value="${index}`)!.checked = true;
    // }

    // TODO add selected class to selected effect
    // const selElement = document.querySelector('#fxlist .selected');
    // if (selElement) {
    //   selElement.classList.remove('selected')
    // }
    // document.querySelector(`#fxlist .lstI[data-id="${index}"]`)!.classList.add('selected');

    const obj = {
      seg: { fx: index },
    };
    // this.requestJson(obj);
  }
}

/*for (let i = 0; i < this.effects.length; i++) {
  generateListItemHtml(
    'fx',
    this.effects[i].id,
    this.effects[i].name,
    'setX',
    '',
    this.effects[i].class,
  );
}
const generateListItemHtml = (
  // listName: string,
  // id: number | string,
  // name: string,
  // clickAction: string,
  // extraHtml = '',
  // extraClass = '',
) => (
  `<div class="lstI btn fxbtn ${extraClass}" data-id="${id}" onClick="${clickAction}(${id})">
    <label class="radio fxchkl">
      <input type="radio" value="${id}" name="${listName}">
      <span class="radiomark"></span>
    </label>
  <span class="lstIname">
    ${name}
  </span>
  ${extraHtml}
  </div>`
);*/
