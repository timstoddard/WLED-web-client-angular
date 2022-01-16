// TODO add reducers

export interface AppConfig {
  theme: AppTheme;
  comp: AppComp;
}

interface AppTheme {
  base: 'light' | 'dark';
  bg: {
    url: string;
  };
  alpha: {
    bg: number;
    tab: number;
  };
  color: {
    bg: string;
  };
}

interface AppComp { // TODO better name?
  colors: AppColorInputs;
  labels: boolean;
  pcmbot: boolean;
  pid: boolean;
  seglen: boolean;
  css: boolean;
  hdays: boolean;
}

interface AppColorInputs {
  picker: boolean;
  rgb: boolean;
  quick: boolean;
  hex: boolean;
}

export const initAppConfig = (): AppConfig => {
  return {
    theme: {
      base: 'dark',
      bg: {
        url: '',
      },
      alpha: {
        bg: 0.6,
        tab: 0.8,
      },
      color: {
        bg: '',
      },
    },
    comp: {
      colors: {
        picker: true,
        rgb: false,
        quick: true,
        hex: false,
      },
      labels: true,
      pcmbot: false,
      pid: true,
      seglen: false,
      css: true,
      hdays: false,
    },
  };
}
