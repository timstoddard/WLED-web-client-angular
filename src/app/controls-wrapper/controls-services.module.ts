import { NgModule } from '@angular/core';
import { ColorService } from './color.service';
import { ColorSlotsService } from './color-inputs/color-slots/color-slots.service';
import { ApiDataResolver } from './api-data.resolver';
import { ControlsService } from './controls.service';
import { EffectsService } from './effects/effects.service';
import { InfoService } from './info/info.service';
import { PalettesService } from './palettes/palettes.service';
import { PresetsService } from './presets/presets.service';
import { SegmentsService } from './segments/segments.service';
import { TopMenuBarService } from './top-menu-bar/top-menu-bar.service';
import { PresetsResolver } from './presets/presets.resolver';

/** This module is used exclusively to provide all the services used by `ControlsWrapperComponent` and its child components. */
@NgModule({
  providers: [
    ApiDataResolver,
    ColorService,
    ColorSlotsService,
    ControlsService,
    EffectsService,
    InfoService,
    PalettesService,
    PresetsService,
    PresetsResolver,
    SegmentsService,
    TopMenuBarService,
  ],
})
export class ControlsServicesModule {}
