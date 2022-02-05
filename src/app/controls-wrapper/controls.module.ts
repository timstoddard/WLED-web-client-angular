import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BottomMenuBarComponent } from './bottom-menu-bar/bottom-menu-bar.component';
import { ColorInputsComponent } from './color-inputs/color-inputs.component';
import { ColorPickerComponent } from './color-inputs/color-picker/color-picker.component';
import { ColorPresetsComponent } from './color-inputs/color-presets/color-presets.component';
import { ColorSliderComponent } from './shared/color-slider/color-slider.component';
import { ColorSlotsComponent } from './color-inputs/color-slots/color-slots.component';
import { ControlsComponent } from './controls/controls.component';
import { ControlsWrapperComponent } from './controls-wrapper.component';
import { ControlsRoutingModule } from './controls-routing.module';
import { ControlsServicesModule } from './controls-services.module';
import { EffectsComponent } from './effects/effects.component';
import { HexInputComponent } from './color-inputs/hex-input/hex-input.component';
// import { InfoComponent } from './info/info.component';
// import { NodesComponent } from './nodes/nodes.component';
import { PalettesComponent } from './palettes/palettes.component';
import { PresetFormComponent } from './presets/preset-form/preset-form.component';
import { PresetQuickLoadComponent } from './presets/preset-quick-load/preset-quick-load.component';
import { PresetsComponent } from './presets/presets.component';
import { RgbSlidersComponent } from './color-inputs/rgb-sliders/rgb-sliders.component';
// import { RoverComponent } from './rover/rover.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SegmentComponent } from './segments/segment/segment.component';
import { SegmentsComponent } from './segments/segments.component';
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
  BottomMenuBarComponent,
  ControlsComponent,
  ControlsWrapperComponent,
  EffectsComponent,
  // InfoComponent,
  // NodesComponent,
  PalettesComponent,
  PresetFormComponent,
  PresetQuickLoadComponent,
  PresetsComponent,
  // RoverComponent,
  SearchInputComponent,
  SegmentComponent,
  SegmentsComponent,
  TopMenuBarComponent,
  COLOR_INPUTS,
  SHARED_COMPONENTS,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    ControlsRoutingModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    ControlsServicesModule,
    ReactiveFormsModule,
  ],
})
export class ControlsModule { }
