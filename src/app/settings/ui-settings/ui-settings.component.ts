import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private uiSettingsService: UISettingsService,
    private uiConfigService: UIConfigService,
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
    // TODO redirect
  }

  private createForm() {
    // TODO get default values from server/api (is this currently possible? existing website has them hardcoded into the html)
    return this.formBuilder.group({
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
  }
}
