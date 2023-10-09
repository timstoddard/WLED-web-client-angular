import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { PalettesService } from './palettes.service';

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

  constructor(
    private palettesService: PalettesService,
    private formSerivce: FormService,
  ) {
    super();
  }

  ngOnInit() {
    this.setPalette(NO_PALETTE_SELECTED);
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

  private setPalette(paletteId: number) {
    const result = this.palettesService.setPalette(paletteId);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe();
    }
  }

  private createFormControl() {
    const control = this.formSerivce.createFormControl<number>(NO_PALETTE_SELECTED);

    this.handleUnsubscribe(control.valueChanges)
      .subscribe((paletteId: number) => this.setPalette(paletteId));

    return control;
  }
}
