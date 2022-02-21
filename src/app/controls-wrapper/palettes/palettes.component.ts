import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { genericPostResponse } from '../utils';
import { PaletteWithBackground, PalettesService } from './palettes.service';

const DEFAULT_PALETTE_ID = -1; // TODO get from first selected segment

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss'],
  // need to provide here (child of routed component) so the service can access the activated route
  providers: [PalettesService],
})
export class PalettesComponent extends UnsubscribingComponent implements OnInit {
  selectedPalette!: FormControl;

  constructor(
    private palettesService: PalettesService,
    private formBuilder: FormBuilder,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.setPalette(DEFAULT_PALETTE_ID);
    this.selectedPalette = this.createFormControl();
  }

  getSelectedPaletteName() {
    return this.palettesService.getSelectedPaletteName();
  }

  getFilteredPalettes() {
    return this.palettesService.getFilteredPalettes();
  }

  filterList(filterText: string) {
    this.palettesService.filterPalettes(filterText);
  }

  private setPalette(paletteId: number) {
    const result = this.palettesService.setPalette(paletteId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(genericPostResponse(this.appStateService));
    }
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_PALETTE_ID);

    this.handleUnsubscribe<number>(control.valueChanges)
      .subscribe((paletteId: number) => this.setPalette(paletteId));

    return control;
  }
}
