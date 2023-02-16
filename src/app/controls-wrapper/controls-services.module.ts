import { NgModule } from '@angular/core';
import { ColorService } from './color.service';
import { ColorSlotsService } from './color-inputs/color-slots/color-slots.service';
import { ControlsResolver } from './controls.resolver';
import { ControlsService } from './controls.service';
import { EffectsService } from './effects/effects.service';
import { InfoService } from './info/info.service';
import { PalettesDataResolver } from './palettes/palettes-data.resolver';
import { PalettesService } from './palettes/palettes.service';
import { PresetsResolver } from './presets/presets.resolver';
import { PresetsService } from './presets/presets.service';
import { SegmentsService } from './segments/segments.service';
import { TopMenuBarService } from './top-menu-bar/top-menu-bar.service';

/** This module is used exclusively to provide all the services used by `ControlsWrapperComponent` and its child components. */
@NgModule({
  providers: [
    ColorService,
    ColorSlotsService,
    ControlsResolver,
    ControlsService,
    EffectsService,
    InfoService,
    PalettesDataResolver,
    PalettesService,
    PresetsResolver,
    PresetsService,
    SegmentsService,
    TopMenuBarService,
  ],
})
export class ControlsServicesModule {}
