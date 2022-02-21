import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Subject, takeUntil } from 'rxjs';

export interface AppUIConfig {
  /** Theme settings. */
  theme: AppTheme;
  /** Settings to show/hide the various color inputs. */
  showColorInputs: AppColorInputs;
  /** Show/hide labels on top and bottom menu bar buttons. */
  showLabels: boolean;
  // TODO is this needed?
  /** Show bottom tab bar in PC mode. */
  pcmbot: boolean;
  /** Show/hide preset IDs. */
  showPresetIds: boolean;
  /** Set segment length instead of stop LED. */
  useSegmentLength: boolean;
  /** Enable custom CSS. */
  useCustomCss: boolean;
  /** Enable custom holidays list. */
  enableHolidays: boolean;
}

// TODO restructure these options? based on usage
interface AppTheme {
  /** Set dark or light mode. */
  base: 'light' | 'dark';
  background: {
    /** Background image URL. */
    url: string;
    /** Use random background image. */
    random: boolean;
  };
  alpha: {
    /** Background opacity. */
    background: number;
    /** Button opacity. */
    buttons: number;
  };
  color: {
    /** Background hex color. */
    background: string;
  };
}

interface AppColorInputs {
  /** Show/hide the color wheel picker. */
  picker: boolean;
  /** Show/hide the rgb sliders. */
  rgb: boolean;
  /** Show/hide the color preset buttons. */
  presets: boolean;
  /** Show/hide the hex input. */
  hex: boolean;
}

const DEFAULT_UI_CONFIG: AppUIConfig = {
  theme: {
    base: 'dark',
    background: {
      url: '',
      random: false,
    },
    alpha: {
      background: 0.6,
      buttons: 0.8,
    },
    color: {
      background: '',
    },
  },
  showColorInputs: {
    picker: true,
    rgb: true,
    presets: true,
    hex: true,
  },
  showLabels: true,
  pcmbot: false,
  showPresetIds: true,
  useSegmentLength: false,
  useCustomCss: true,
  enableHolidays: false,
};

// TODO combine with app state service
@Injectable({ providedIn: 'root' })
export class UIConfigService {
  private uiConfigStore: Store;

  constructor() {
    this.uiConfigStore = new Store({
      name: 'WLED UI Config',
      ...createState(withProps<AppUIConfig>(DEFAULT_UI_CONFIG)),
    });
  }

  getUIConfig = (ngUnsubscribe: Subject<void>) =>
    this.selectFromUIConfig((n) => n)
      .pipe<AppUIConfig>(takeUntil(ngUnsubscribe));

  setAll = (uiConfig: AppUIConfig) => {
    this.uiConfigStore.update(() => ({
      theme: {
        base: uiConfig.theme.base,
        background: {
          url: uiConfig.theme.background.url,
          random: uiConfig.theme.background.random,
        },
        alpha: {
          background: uiConfig.theme.alpha.background,
          buttons: uiConfig.theme.alpha.buttons,
        },
        color: {
          background: uiConfig.theme.color.background,
        },
      },
      showColorInputs: {
        picker: uiConfig.showColorInputs.picker,
        rgb: uiConfig.showColorInputs.rgb,
        presets: uiConfig.showColorInputs.presets,
        hex: uiConfig.showColorInputs.hex,
      },
      showLabels: uiConfig.showLabels,
      pcmbot: uiConfig.pcmbot,
      showPresetIds: uiConfig.showPresetIds,
      useSegmentLength: uiConfig.useSegmentLength,
      useCustomCss: uiConfig.useCustomCss,
      enableHolidays: uiConfig.enableHolidays,
    }));
  }

  setThemeBase = (base: AppTheme['base']) =>
    this.updateTheme({ base });
  setThemeBackground = (background: AppTheme['background']) =>
    this.updateTheme({ background });
  setThemeAlpha = (alpha: AppTheme['alpha']) =>
    this.updateTheme({ alpha });
  setThemeColor = (color: AppTheme['color']) =>
    this.updateTheme({ color });
  setShowColorPicker = (picker: AppColorInputs['picker']) =>
    this.updateShowColorInputs({ picker });
  setShowRgb = (rgb: AppColorInputs['rgb']) =>
    this.updateShowColorInputs({ rgb });
  setShowColorPresets = (presets: AppColorInputs['presets']) =>
    this.updateShowColorInputs({ presets });
  setShowHexInput = (hex: AppColorInputs['hex']) =>
    this.updateShowColorInputs({ hex });
  setShowLabels = (showLabels: AppUIConfig['showLabels']) =>
    this.updateUIConfig({ showLabels });
  setShowPresetIds = (showPresetIds: AppUIConfig['showPresetIds']) =>
    this.updateUIConfig({ showPresetIds });
  setUseSegmentLength = (useSegmentLength: AppUIConfig['useSegmentLength']) =>
    this.updateUIConfig({ useSegmentLength });
  setUseCustomCss = (useCustomCss: AppUIConfig['useCustomCss']) =>
    this.updateUIConfig({ useCustomCss });
  setEnableHolidays = (enableHolidays: AppUIConfig['enableHolidays']) =>
    this.updateUIConfig({ enableHolidays });
  
  private selectFromUIConfig = (selectFn: (state: AppUIConfig) => any) =>
    this.uiConfigStore.pipe(select(selectFn));

  private updateUIConfig = (newUIConfig: Partial<AppUIConfig>) => {
    this.uiConfigStore.update((uiConfig) => ({
      ...uiConfig,
      ...newUIConfig,
    }));
  }

  private updateTheme = (newTheme: Partial<AppTheme>) => {
    this.uiConfigStore.update((uiConfig) => ({
      ...uiConfig,
      theme: {
        ...uiConfig.theme,
        ...newTheme,
      },
    }));
  }

  private updateShowColorInputs = (newColorInputs: Partial<AppColorInputs>) => {
    this.uiConfigStore.update((uiConfig) => ({
      ...uiConfig,
      showColorInputs: {
        ...uiConfig.theme,
        ...newColorInputs,
      },
    }));
  }
}
