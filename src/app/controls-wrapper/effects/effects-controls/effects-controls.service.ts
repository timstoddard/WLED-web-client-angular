import { Injectable } from '@angular/core';
import { AppEffect, EffectParameterLabel } from 'src/app/shared/app-types/app-effects';
import { DEFAULT_EFFECT_DATA } from 'src/app/shared/effects-data.service';

export interface EffectsSliderConfig extends EffectParameterLabel {
  min: number;
  max: number;
  formControlName: string;
}

export interface EffectsCheckboxConfig extends EffectParameterLabel {
  formControlName: string;
}

@Injectable()
export class EffectsControlsService {
  getEffectControls(effect: AppEffect) {
    const {
      parameterLabels,
      // TODO wire this up to color controls component
      colorLabels,
      // TODO wire this up to palettes component
      usesPalette,
    } = effect;
    const MAX_SLIDERS = 5;
    const MAX_CHECKBOXES = 3;

    const sliderLabels: string[] = [];
    for (let i = 0; i < MAX_SLIDERS; i++) {
      let sliderLabel = '';
      // if (not controlDefined and for AC speed or intensity and for SR all sliders) or slider has a value
      if (
        (
          (effect.effectDataString === DEFAULT_EFFECT_DATA)
          && i < ((effect.id < 128) ? 2 : MAX_SLIDERS)
        )
        || (parameterLabels.length > i && parameterLabels[i] !== '')
      ) {
        if (parameterLabels.length > i && parameterLabels[i] !== '!') {
          sliderLabel = parameterLabels[i];
        } else if (i === 0) {
          sliderLabel = 'Speed'; // formerly 'Effect speed'
        } else if (i === 1) {
          sliderLabel = 'Intensity'; // formerly 'Effect intensity'
        } else {
          sliderLabel = `Custom${i - 1}`;
        }
      }
      sliderLabels.push(sliderLabel);
    }

    const optionLabels: string[] = [];
    for (let i = 0; i < MAX_CHECKBOXES; i++) {
      const optionIndex = MAX_SLIDERS + i;
      const rawOptionLabel = parameterLabels[optionIndex];
      let optionLabel = '';
      if (rawOptionLabel) {
        optionLabel = rawOptionLabel === '!'
          ? `Option${i + 1}`
          : rawOptionLabel.substring(0, 16);
      }
      optionLabels.push(optionLabel);
    }

    const sliderConfigs = this.buildSliderConfigs(sliderLabels);
    const optionConfigs = this.buildOptionConfigs(optionLabels);

    return {
      sliderConfigs,
      optionConfigs,
    };
  }

  private buildSliderConfigs(sliderLabels: string[]) {
    const EXPECTED_SLIDER_LABEL_LENGTH = 5;
    if (sliderLabels.length !== EXPECTED_SLIDER_LABEL_LENGTH) {
      throw new Error(`sliderLabels expected to have length ${EXPECTED_SLIDER_LABEL_LENGTH}, found ${sliderLabels.length}`);
    }

    /** Must be length 5. */
    const baseConfigs: Partial<EffectsSliderConfig>[] = [
      {
        formControlName: 'speed',
        apiField: 'sx',
        min: 0,
        max: 255,
      },
      {
        formControlName: 'intensity',
        apiField: 'ix',
        min: 0,
        max: 255,
      },
      {
        formControlName: 'custom1',
        apiField: 'c1',
        min: 0,
        max: 255,
      },
      {
        formControlName: 'custom2',
        apiField: 'c2',
        min: 0,
        max: 255,
      },
      {
        formControlName: 'custom3',
        apiField: 'c3',
        min: 0,
        max: 31,
      },
    ];

    const sliderConfigs: EffectsSliderConfig[] = [];
    for (let i = 0; i < sliderLabels.length; i++) {
      const sliderLabel = sliderLabels[i];
      if (sliderLabel) {
        sliderConfigs.push(Object.assign({}, baseConfigs[i], {
          label: sliderLabel,
        }) as EffectsSliderConfig);
      }
    }
    return sliderConfigs;
  }

  private buildOptionConfigs(optionLabels: string[]) {
    const EXPECTED_OPTION_LABEL_LENGTH = 3;
    if (optionLabels.length !== EXPECTED_OPTION_LABEL_LENGTH) {
      throw new Error(`optionLabels expected to have length ${EXPECTED_OPTION_LABEL_LENGTH}, found ${optionLabels.length}`);
    }

    /** Must be length 3. */
    const baseConfigs: Partial<EffectsCheckboxConfig>[] = [
      {
        formControlName: 'option1',
        apiField: 'o1',
      },
      {
        formControlName: 'option2',
        apiField: 'o2',
      },
      {
        formControlName: 'option3',
        apiField: 'o3',
      },
    ];

    const optionConfigs: EffectsCheckboxConfig[] = [];
    for (let i = 0; i < optionLabels.length; i++) {
      const optionLabel = optionLabels[i];
      if (optionLabel) {
        optionConfigs.push(Object.assign({}, baseConfigs[i], {
          label: optionLabel,
        }) as EffectsCheckboxConfig);
      }
    }
    return optionConfigs;
  }
}
