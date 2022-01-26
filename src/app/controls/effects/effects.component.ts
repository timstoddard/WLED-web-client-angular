import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { compareNames } from '../utils';

const DEFAULT_EFFECT_ID = 0;
const DEFAULT_EFFECT_SPEED = 128;
const DEFAULT_EFFECT_INTENSITY = 128;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss']
})
export class EffectsComponent extends UnsubscribingComponent implements OnInit {
  // TODO how to load/get effects? TODO get actual list from api call
  @Input() effects = new Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i,
      name: `Effect ${i + 1}`,
    }));
  effectsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    /*this.effects.shift(); // remove solid
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
    });*/

    this.effectsForm = this.createForm();
  }
  
  toggleLabels() {
    // config.comp.labels = !config.comp.labels;
    // this.applyCfg(config);
  }

  setEffect(effectId = -1) {
    console.log(`selected effect [id=${effectId}]`);

    // TODO update data model to set selected effect by `effectId`
    // if (effectId === -1) {
    //   effectId = parseInt(document.querySelector('#fxlist input[name="fx"]:checked')!.value);
    // } else {
    //   document.querySelector(`#fxlist input[name="fx"][value="${effectId}`)!.checked = true;
    // }

    // TODO add selected class to selected effect
    // const selElement = document.querySelector('#fxlist .selected');
    // if (selElement) {
    //   selElement.classList.remove('selected')
    // }
    // document.querySelector(`#fxlist .lstI[data-id="${effectId}"]`)!.classList.add('selected');

    const obj = {
      seg: { fx: effectId },
    };
    // this.requestJson(obj);
  }

  setSpeed(speed: number) {
    console.log('setSpeed', speed);
    // TODO implement
  }
  
  setIntensity(intensity: number) {
    console.log('setIntensity', intensity);
    // TODO implement
  }

  private createForm() {
    const form = this.formBuilder.group({
      selectedEffect: this.formBuilder.control(DEFAULT_EFFECT_ID),
      speed: this.formBuilder.control(DEFAULT_EFFECT_SPEED),
      intensity: this.formBuilder.control(DEFAULT_EFFECT_INTENSITY),
    });

    form.get('selectedEffect')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((effectId: number) => {
        this.setEffect(effectId); // TODO should call effect service?
      });

    form.get('speed')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((speed: number) => {
        this.setSpeed(speed); // TODO should call effect service?
      });

    form.get('intensity')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((intensity: number) => {
        this.setIntensity(intensity); // TODO should call effect service?
      });

    return form;
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
