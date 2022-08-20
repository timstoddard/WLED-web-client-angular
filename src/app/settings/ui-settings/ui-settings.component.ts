import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageKey, LocalStorageService } from '../../shared/local-storage.service';
import { AppUIConfig, UIConfigService } from '../../shared/ui-config.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { UISettingsService } from './ui-settings.service';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.scss']
})
export class UISettingsComponent extends UnsubscribingComponent implements OnInit {
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
      // TODO rename to not have 'preset' in the name
      label: 'Preset Buttons',
    },
    {
      name: 'hex',
      label: 'Hex Color Input',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private uiSettingsService: UISettingsService,
    private uiConfigService: UIConfigService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.uiSettingsForm = this.createForm();
  }

  submitForm() {
    const {
      serverDescription,
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

    const formValue = {
      DS: serverDescription,
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

  getShouldToggleReceiveWithSendDescription() {
    const { value } = this.uiSettingsForm.get('shouldToggleReceiveWithSend')!;
    // TODO changing text on click is jarring
    return `Control ${value ? 'both' : 'only' } send ${value ? 'and receive ' : '' }with Sync button`;
  }

  private createForm() {
    const form = this.formBuilder.group({
      serverDescription: this.formBuilder.control('WLED'),
      shouldToggleReceiveWithSend: this.formBuilder.control(false),
      showColorInputs: this.formBuilder.group({
        picker: this.formBuilder.control(true),
        rgb: this.formBuilder.control(false),
        presets: this.formBuilder.control(true),
        hex: this.formBuilder.control(false),
      }),
      showLabels: this.formBuilder.control(true),
      // TODO add toggle for showing bottom menu in pc mode?
      showPresetIds: this.formBuilder.control(true),
      useSegmentLength: this.formBuilder.control(false),
      isDarkMode: this.formBuilder.control(true),
      backgroundOpacity: this.formBuilder.control(0.6),
      buttonOpacity: this.formBuilder.control(0.8),
      backgroundHexColor: this.formBuilder.control(''),
      backgroundImageUrl: this.formBuilder.control(''),
      useRandomBackgroundImage: this.formBuilder.control(false),
      useCustomCss: this.formBuilder.control(false),
      customCssFile: this.formBuilder.control(null),
      enableHolidays: this.formBuilder.control(false),
      holidaysFile: this.formBuilder.control(null),
    });

    const config = this.localStorageService.get<AppUIConfig>(LocalStorageKey.UI_CONFIG);
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
}
