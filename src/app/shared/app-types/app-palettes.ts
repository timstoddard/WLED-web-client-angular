import { SearchableItem } from 'src/app/controls-wrapper/search-input/search-input.component';

export interface AppPaletteWithoutBackground extends SearchableItem {
}

export interface AppPaletteWithBackground extends SearchableItem {
  background: string;
}
