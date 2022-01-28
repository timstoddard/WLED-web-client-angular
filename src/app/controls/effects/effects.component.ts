import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { WledApiResponse } from '../../shared/api-types';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { compareNames, genericPostResponse } from '../utils';
import { EffectsService } from './effects.service';

interface Effect {
  id: number;
  name: string;
}

const DEFAULT_EFFECT_ID = 0;
const DEFAULT_EFFECT_SPEED = 128;
const DEFAULT_EFFECT_INTENSITY = 128;

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss']
})
export class EffectsComponent extends UnsubscribingComponent implements OnInit {
  sortedEffects!: Effect[];
  effectsForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private effectsService: EffectsService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.sortedEffects = this.getSortedEffects();
    this.effectsForm = this.createForm();
  }

  private getSortedEffects() {
    const effectNames = (this.route.snapshot.data['data'] as WledApiResponse).effects;

    const sortedEffects = effectNames.slice(1) // remove 'Solid'
      .map((name, i) => ({
        id: i + 1,
        name,
      }));
    sortedEffects.sort(compareNames);
    sortedEffects.unshift({
      id: DEFAULT_EFFECT_ID,
      name: 'Solid',
    });

    return sortedEffects;
  }
  
  toggleLabels() {
    // config.comp.labels = !config.comp.labels;
    // this.applyCfg(config);
  }

  setEffect_old(effectId = -1) {
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
  }

  private setEffect(effectId: number) {
    this.effectsService.setEffect(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse);
  }

  private setSpeed(effectId: number) {
    this.effectsService.setSpeed(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse);
  }

  private setIntensity(effectId: number) {
    this.effectsService.setIntensity(effectId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse);
  }

  private createForm() {
    const form = this.formBuilder.group({
      selectedEffect: this.formBuilder.control(DEFAULT_EFFECT_ID),
      speed: this.formBuilder.control(DEFAULT_EFFECT_SPEED),
      intensity: this.formBuilder.control(DEFAULT_EFFECT_INTENSITY),
    });

    form.get('selectedEffect')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((effectId: number) => this.setEffect(effectId));

    form.get('speed')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((speed: number) => this.setSpeed(speed));

    form.get('intensity')!.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((intensity: number) => this.setIntensity(intensity));

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
