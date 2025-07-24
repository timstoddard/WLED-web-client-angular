import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService, FormValues, createGetFormControl, getFormControl, getFormControlFn } from '../../shared/form-service';
import { LocalStorageKey, LocalStorageService } from '../../shared/local-storage.service';
import { AppUIConfig, UIConfigService } from '../../shared/ui-config.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { UISettingsService } from './ui-settings.service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.scss']
})
export class UISettingsComponent extends UnsubscriberComponent implements OnInit {
  uiSettingsForm!: FormGroup;

  colorInputCheckboxes = [
    {
      name: 'picker',
      label: 'Color wheel',
    },
    {
      name: 'rgb',
      label: 'RGB Sliders',
    },
    {
      name: 'presets',
      label: 'Color Presets',
    },
    {
      name: 'hex',
      label: 'Hex Color Input',
    },
  ];
  getFormControl!: getFormControlFn;

  serverNameInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.uiSettingsForm, 'serverName'),
    placeholder: 'WLED',
    widthPx: 180,
  };

  backgroundOpacityInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.uiSettingsForm, 'backgroundOpacity'),
    placeholder: '0.6',
    widthPx: 80,
    step: 0.1,
  };

  buttonOpacityInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.uiSettingsForm, 'buttonOpacity'),
    placeholder: '0.8',
    widthPx: 80,
    step: 0.1,
  };

  backgroundHexInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.uiSettingsForm, 'backgroundHexColor'),
    placeholder: 'ffffff',
    widthPx: 180,
  };

  backgroundImageInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.uiSettingsForm, 'backgroundImageUrl'),
    placeholder: '',
    widthPx: 300,
  };

  constructor(
    private formService: FormService,
    private uiSettingsService: UISettingsService,
    private uiConfigService: UIConfigService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.uiSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.uiSettingsForm);
  }

  submitForm() {
    const {
      serverName,
      shouldToggleReceiveWithSend,
      showColorInputs,
      showLabels,
      showPresetIds,
      useSegmentLength,
      isDarkMode,
      backgroundOpacity,
      buttonOpacity,
      backgroundHexColor,
      backgroundImageUrl,
      useRandomBackgroundImage,
      useCustomCss,
      customCssFile,
      enableHolidays,
      holidaysFile,
    } = this.uiSettingsForm.value;

    // TODO add section for nightlight settings
    const uiConfig: AppUIConfig = {
      theme: {
        base: isDarkMode ? 'dark' : 'light',
        background: {
          url: backgroundImageUrl,
          random: useRandomBackgroundImage,
        },
        alpha: {
          background: backgroundOpacity,
          buttons: buttonOpacity,
        },
        color: {
          background: backgroundHexColor,
        },
      },
      showColorInputs: {
        picker: showColorInputs.picker,
        rgb: showColorInputs.rgb,
        presets: showColorInputs.presets,
        hex: showColorInputs.hex,
      },
      showLabels,
      showPresetIds,
      useSegmentLength,
      useCustomCss,
      enableHolidays,
    };
    this.uiConfigService.setAll(uiConfig);

    // TODO use transformUISettingsToWledUISettings()
    const formValue = {
      DS: serverName,
      // TODO server checks for existence not truthiness
      ST: shouldToggleReceiveWithSend ? true : undefined,
      // TODO are these handled separately or here?
      data: customCssFile,
      data2: holidaysFile,
    };

    console.log(formValue);
    this.handleUnsubscribe(
      this.uiSettingsService.setUISettings(formValue));
    
    // TODO should this be conditional?
    this.router.navigate(['controls']);
  }

  uploadFile() {
    // TODO implement
  }

  private createForm() {
    // TODO use form service utils
    const form = this.formService.createFormGroup(this.getDefaultFormValues(), {
      backgroundImageUrl: this.formService.formBuilder.control(''),
      backgroundHexColor: this.formService.formBuilder.control(''),
    });

    const defaultConfig: any = {}; // TODO better defaults
    const config = this.localStorageService.get<AppUIConfig>(LocalStorageKey.UI_CONFIG, defaultConfig);
    if (config) {
      const formValue = {
        showColorInputs: {
          picker: config.showColorInputs.picker,
          rgb: config.showColorInputs.rgb,
          presets: config.showColorInputs.presets,
          hex: config.showColorInputs.hex,
        },
        showLabels: config.showLabels,
        showPresetIds: config.showPresetIds,
        useSegmentLength: config.useSegmentLength,
        isDarkMode: config.theme.base === 'dark',
        backgroundOpacity: config.theme.alpha.background,
        buttonOpacity: config.theme.alpha.buttons,
        backgroundHexColor: config.theme.color.background,
        backgroundImageUrl: config.theme.background.url,
        useRandomBackgroundImage: config.theme.background.random,
        useCustomCss: config.useCustomCss,
        enableHolidays: config.enableHolidays,
      };
      form.patchValue(formValue, { emitEvent: false });
      this.uiConfigService.setAll(config);
    }

    return form;
  }

  private getDefaultFormValues(): FormValues {
    return {
      serverName: 'WLED',
      shouldToggleReceiveWithSend: false,
      showColorInputs: {
        picker: true,
        rgb: false,
        presets: true,
        hex: false,
      },
      showLabels: true,
      // TODO add toggle for showing bottom menu in pc mode?
      showPresetIds: true,
      useSegmentLength: false,
      isDarkMode: true,
      backgroundOpacity: 0.6,
      buttonOpacity: 0.8,
      // backgroundHexColor: '',
      // backgroundImageUrl: '',
      useRandomBackgroundImage: false,
      useCustomCss: false,
      customCssFile: '',
      enableHolidays: false,
      holidaysFile: '',
    };
  }
}
