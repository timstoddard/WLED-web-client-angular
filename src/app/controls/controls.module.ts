import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// import { BottomMenuBarComponent } from './bottom-menu-bar/bottom-menu-bar.component';
import { ColorInputsComponent } from './color-inputs/color-inputs.component';
import { ColorPickerComponent } from './color-inputs/color-picker/color-picker.component';
import { ColorPresetsComponent } from './color-inputs/color-presets/color-presets.component';
import { ColorSliderComponent } from './shared/color-slider/color-slider.component';
import { ColorSlotsComponent } from './color-inputs/color-slots/color-slots.component';
import { ControlsComponent } from './controls.component';
import { EffectsComponent } from './effects/effects.component';
import { HexInputComponent } from './color-inputs/hex-input/hex-input.component';
// import { InfoComponent } from './info/info.component';
// import { NodesComponent } from './nodes/nodes.component';
import { PalettesComponent } from './palettes/palettes.component';
// import { PresetsComponent } from './presets/presets.component';
import { RgbSlidersComponent } from './color-inputs/rgb-sliders/rgb-sliders.component';
// import { RoverComponent } from './rover/rover.component';
import { SearchInputComponent } from './search-input/search-input.component';
// import { SegmentsComponent } from './segments/segments.component';
import { TopMenuBarComponent } from './top-menu-bar/top-menu-bar.component';
import { WhitenessSlidersComponent } from './color-inputs/whiteness-sliders/whiteness-sliders.component';

const COLOR_INPUTS = [
  ColorInputsComponent,
  ColorPickerComponent,
  ColorPresetsComponent,
  ColorSlotsComponent,
  HexInputComponent,
  RgbSlidersComponent,
  WhitenessSlidersComponent,
];

const SHARED_COMPONENTS = [
  ColorSliderComponent,
]

const COMPONENTS = [
  // BottomMenuBarComponent,
  ControlsComponent,
  EffectsComponent,
  // InfoComponent,
  // NodesComponent,
  PalettesComponent,
  // PresetsComponent,
  // RoverComponent,
  SearchInputComponent,
  // SegmentsComponent,
  TopMenuBarComponent,
  COLOR_INPUTS,
  SHARED_COMPONENTS,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ControlsModule { }
