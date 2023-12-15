export type WLEDPaletteColor = Array<number[] | 'r' | 'c1' | 'c2' | 'c3'>;

export interface WLEDPaletteColors {
  [key: number]: WLEDPaletteColor;
}

export interface WLEDPalettesData {
  p: WLEDPaletteColors;
  m: number;
}
