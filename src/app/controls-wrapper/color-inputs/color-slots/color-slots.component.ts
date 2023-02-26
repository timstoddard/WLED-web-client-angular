import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorSlotsService } from './color-slots.service';
import { ColorInputsComponent } from '../color-inputs.component';

// TODO variable number of slots

// TODO look into replacing this component with the multi-color provided by the color picker

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private colorSlotsService: ColorSlotsService,
  ) {
  }

  ngOnInit() {
    // TODO select slot after getting api data (might be different than default?)
    // this.selectSlot(this.selectedSlot); // after getting api data
  }

  /**
   * Selects the specified slot. Optionally also options the dialog, which should happen under the following conditions:
   * - slot was not selected, and does not yet have a color
   * - slot was already selected
   * @param slot 
   * @param openDialog 
   */
  selectSlot(slot: number) {
    const hasOpenDialog = this.colorSlotsService.getIsColorInputDialogOpen();
    // TODO better way of determining "should open"
    const shouldOpenDialog = this.colorSlotsService.isSlotSelected(slot);

    this.colorSlotsService.selectSlot(slot);

    if (!hasOpenDialog && shouldOpenDialog) {
      const dialogRef = this.dialog.open(ColorInputsComponent);
      this.colorSlotsService.setIsColorInputDialogOpen(true);

      dialogRef.afterClosed().subscribe(result => {
        this.colorSlotsService.setIsColorInputDialogOpen(false);
      });
    }
  }

  getSlots() {
    return this.colorSlotsService.getSlots();
  }

  getButtonClasses(slot: number) {
    const isSelected = this.colorSlotsService.isSlotSelected(slot);
    return {
      'colorSlots__slot--selected': isSelected,
    };
  }

  getButtonStyle(slot: number) {
    // TODO keep white value here or just show color?
    const whiteValueScaled = Math.floor(this.colorSlotsService.getWhiteChannel(slot) / 2) + 128;
    const backgroundHex = `#${this.colorSlotsService.getColorHex(slot)}${whiteValueScaled.toString(16)}`;
    return {
      background: backgroundHex,
    };
  }
}
