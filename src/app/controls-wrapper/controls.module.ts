import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BottomMenuBarComponent } from './bottom-menu-bar/bottom-menu-bar.component';
import { ColorAndWhitenessSlidersComponent } from './color-inputs/color-and-whiteness-sliders/color-and-whiteness-sliders.component';
import { ColorInputsComponent } from './color-inputs/color-inputs.component';
import { ColorPickerComponent } from './color-inputs/color-picker/color-picker.component';
import { ColorPresetsComponent } from './color-inputs/color-presets/color-presets.component';
import { ColorSliderComponent } from './shared/color-slider/color-slider.component';
import { ColorSlotsComponent } from './color-inputs/color-slots/color-slots.component';
import { ControlsComponent } from './controls/controls.component';
import { ControlsWrapperComponent } from './controls-wrapper.component';
import { ControlsRoutingModule } from './controls-routing.module';
import { ControlsServicesModule } from './controls-services.module';
import { DeviceSelectorComponent } from './top-menu-bar/device-selector/device-selector.component';
import { EffectsComponent } from './effects/effects.component';
import { ExpandIconComponent } from '../shared/expand-icon/expand-icon.component';
import { HexInputComponent } from './color-inputs/hex-input/hex-input.component';
import { InfoComponent } from './info/info.component';
import { LiveViewModule } from '../shared/live-view/live-view.module';
import { NewSegmentComponent } from './segments/new-segment/new-segment.component';
import { OverlayContainerComponent } from '../shared/overlay-container/overlay-container.component';
import { PalettesComponent } from './palettes/palettes.component';
import { PresetCycleComponent } from './presets/preset-cycle/preset-cycle.component';
import { PresetFormComponent } from './presets/preset-form/preset-form.component';
import { PresetListComponent } from './presets/preset-list/preset-list.component';
import { PresetQuickLoadComponent } from './presets/preset-quick-load/preset-quick-load.component';
import { PresetsComponent } from './presets/presets.component';
import { RgbSlidersComponent } from './color-inputs/rgb-sliders/rgb-sliders.component';
// import { RoverComponent } from './rover/rover.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SegmentFormComponent } from './segments/segment-form/segment-form.component';
import { SegmentListComponent } from './segments/segment-list/segment-list.component';
import { SegmentsComponent } from './segments/segments.component';
import { TextInputComponent } from '../shared/text-input/text-input.component';
import { TopMenuBarComponent } from './top-menu-bar/top-menu-bar.component';

const COLOR_INPUTS = [
  ColorAndWhitenessSlidersComponent,
  ColorInputsComponent,
  ColorPickerComponent,
  ColorPresetsComponent,
  ColorSlotsComponent,
  HexInputComponent,
  RgbSlidersComponent,
];

const SHARED_COMPONENTS = [
  ColorSliderComponent,
  ExpandIconComponent,
  OverlayContainerComponent,
  TextInputComponent,
]

const COMPONENTS = [
  BottomMenuBarComponent,
  ControlsComponent,
  ControlsWrapperComponent,
  DeviceSelectorComponent,
  EffectsComponent,
  InfoComponent,
  NewSegmentComponent,
  PalettesComponent,
  PresetCycleComponent,
  PresetFormComponent,
  PresetListComponent,
  PresetQuickLoadComponent,
  PresetsComponent,
  // RoverComponent,
  SearchInputComponent,
  SegmentFormComponent,
  SegmentListComponent,
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
    ControlsServicesModule,
    LiveViewModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    OverlayModule,
    ReactiveFormsModule,
  ],
})
export class ControlsModule { }
