import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { PalettesService } from './palettes.service';
import { AppPalette } from 'src/app/shared/app-types/app-palettes';
import { PalettesSettingsComponent } from './palettes-settings/palettes-settings.component';

const NO_PALETTE_SELECTED = -1;

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss'],
  // need to provide here (child of routed component) so the service can access the activated route
  providers: [PalettesService],
})
export class PalettesComponent extends UnsubscriberComponent implements OnInit {
  selectedPalette!: FormControl;
  PalettesSettingsComponent = PalettesSettingsComponent;

  constructor(
    private palettesService: PalettesService,
    private formService: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.selectedPalette = this.createFormControl();

    this.handleUnsubscribe(this.palettesService.getSelectedPalette$())
      .subscribe(({ id }) => {
        this.selectedPalette.patchValue(id, { emitEvent: false });
      });
  }

  getSelectedPalette() {
    return this.palettesService.getSelectedPalette$();
  }

  getFilteredPalettes() {
    return this.palettesService.getFilteredPalettes$();
  }

  filterList(filterText: string) {
    this.palettesService.filterPalettes(filterText);
  }

  getHtmlFormattedPaletteName(palette: AppPalette) {
    return this.palettesService.getHtmlFormattedPaletteName(palette);
  }

  private setPalette(paletteId: number) {
    const result = this.palettesService.setPalette(paletteId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe();
    }
  }

  private createFormControl() {
    const control = this.formService.createFormControl<number>(NO_PALETTE_SELECTED);

    this.handleUnsubscribe(control.valueChanges)
      .subscribe((paletteId: number) => this.setPalette(paletteId));

    return control;
  }
}
