import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { genericPostResponse } from '../utils';
import { PaletteBackground, PalettesService } from './palettes.service';

const DEFAULT_PALETTE_ID = 0;

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss'],
  // need to provide here (routed component) so the service can access the activated route
  providers: [PalettesService],
})
export class PalettesComponent extends UnsubscribingComponent implements OnInit {
  sortedPalettes!: PaletteBackground[];
  selectedPalette!: FormControl;
  private selColors!: any; // TODO type // TODO where to get this from

  constructor(
    private palettesService: PalettesService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.sortedPalettes = this.palettesService.getSortedPalettes(DEFAULT_PALETTE_ID);
    this.selectedPalette = this.createFormControl();
  }

  private setPalette(paletteId: number) {
    this.palettesService.setPalette(paletteId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse);
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_PALETTE_ID);
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((paletteId: number) => this.setPalette(paletteId));
    return control;
  }
}
